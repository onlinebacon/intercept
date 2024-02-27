import { ExecutionContext } from '../../script/execution-context.js';
import { ScriptError } from '../../errors/script-error.js';
import { Command } from '../model.js';
import { dataset } from '../../ra-dec-dataset.js';
import { parseTime } from '../../parsers/parse-time.js';
import { calcAriesGHA } from '../../calc/calc-aries-gha.js';
import { toRad } from '../../calc/degrees-radians.js';
import { blankLine, write, writeln } from '../../stdout.js';
import { GP_CALC, flagOn } from '../../flags/flags.js';

const lookup = (name) => {
	return dataset.find(body => body.regex.test(name));
};

const setGP = (ctx, body, time) => {
	const timestamp = `${ctx.date}T${time}${ctx.gmtOffset}`;
	const unixTime = new Date(timestamp)/1000;
	if (isNaN(unixTime)) {
		throw new ScriptError(`Invalid time/date`);
	}
	const { startTime, interval, entries } = body;
	const endTime = startTime + interval*entries.length;
	if (unixTime < startTime || unixTime > endTime) {
		throw new ScriptError(`Timestamp outside of dataset bounds`);
	}
	const i = Math.floor((unixTime - startTime)/interval);
	const a = entries[i];
	const b = entries[i + 1];
	const t = (unixTime - (startTime + i*interval)) / interval;
	const ra = a.ra + (b.ra - a.ra)*t;
	const dec = a.dec + (b.dec - a.dec)*t;
	const ariesGHA = calcAriesGHA(unixTime);
	const lat = dec;
	const sha = 360 - ra/24*360;
	const gha = (sha + ariesGHA) % 360;
	const lon = (360 - gha + 180) % 360 - 180;
	const gp = [ lat, lon ].map(toRad);
	ctx.gp = gp;
	if (flagOn(GP_CALC)) {
		blankLine();
		writeln(body.name, ' at ', time, ':');
		writeln('- SHA: ', ctx.deg(sha));
		writeln('- Dec: ', ctx.deg(dec));
		writeln('- GHA of Aries: ', ctx.deg(ariesGHA));
		writeln('- GHA: ', ctx.deg(gha));
		writeln(`- Longitude: `, ctx.deg(lon));
	}
};

const regex = /^\s*body:/i;
const bodyCommand = new Command({
	name: 'Body',
	description: `
		Sets an approximate geographical position for the next lines of position to reference based on a celestial body's name and a given time.
		Accepted format: Name, hh:mm:ss
		The seconds can be input with decimal figures.
	`,
    regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		if (ctx.date == null) {
			throw new ScriptError('No date input', lineIndex);
		}
		const content = line.replace(regex, '').trim();
		const args = content.split(/\s*,\s*/);
		if (args.length !== 2) {
			throw new ScriptError(`Invalid format`, lineIndex);
		}
		const [ name, strTime ] = args;
		const time = parseTime(strTime);
		if (time == null) {
			throw new ScriptError(`Invalid time format`, lineIndex);
		}
		const body = lookup(name);
		if (!body) {
			throw new ScriptError(`Couldn't find "${name}" in dataset`, lineIndex);
		}
		ctx.defLabel = `${body.name} at ${time}`;
		setGP(ctx, body, time);
	},
});

export default bodyCommand;
