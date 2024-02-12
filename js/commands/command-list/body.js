import { ExecutionContext } from '../../script/execution-context.js';
import { ScriptError } from '../../errors/script-error.js';
import { Command } from '../model.js';
import { dataset } from '../../ra-dec-dataset.js';
import { parseTime } from '../../parsers/parse-time.js';
import { calcAriesGHA } from '../../calc/calc-aries-gha.js';
import { toRad } from '../../calc/degrees-radians.js';

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
	const lon = (ra/24*360 - ariesGHA + 360 + 180) % 360 - 180;
	const gp = [ lat, lon ].map(toRad);
	ctx.gp = gp;
};

const regex = /^\s*body:/i;
const bodyCommand = new Command({
	name: 'Body',
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
		setGP(ctx, body, time);
	},
});

export default bodyCommand;
