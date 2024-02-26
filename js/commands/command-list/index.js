import { ExecutionContext } from '../../script/execution-context.js';
import { ScriptError } from '../../errors/script-error.js';
import { Command } from '../model.js';
import { parseAngle } from '../../parsers/parse-angle.js';
import { CORRECTIONS, flagOn } from '../../flags/flags.js';
import { writeln } from '../../stdout.js';

const regex = /^\s*index:/i;
const indexCommand = new Command({
	name: 'Index',
	description: `
		Sets the index error to be corrected. The default value is zero.
	`,
    regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		const content = line.replace(regex, '').trim();
		const indexErr = parseAngle(content);
		if (isNaN(indexErr)) {
			throw new ScriptError('Invalid angle', lineIndex);
		}
		if (flagOn(CORRECTIONS)) {
			writeln(`Index error: `, ctx.deg(indexErr));
		}
		ctx.indexErr = indexErr;
	},
});

export default indexCommand;
