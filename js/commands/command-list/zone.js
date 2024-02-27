import { ExecutionContext } from '../../script/execution-context.js';
import { ScriptError } from '../../errors/script-error.js';
import { Command } from '../model.js';
import { parseZone } from '../../parsers/parse-zone.js';

const regex = /^\s*zone:/i;

const zoneCommand = new Command({
	name: 'Zone',
	regex,
	description: 'Sets the time zone (GMT offset)',
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		const value = line.replace(regex, '').trim();
		const zone = parseZone(value);
		if (!zone) {
			throw new ScriptError('Invalid time zone', lineIndex);
		}
		ctx.gmtOffset = zone;
	},
});

export default zoneCommand;
