import { ExecutionContext } from '../../script/execution-context.js';
import { ScriptError } from '../../errors/script-error.js';
import { Command } from '../model.js';
import { parseAngle } from '../../parsers/parse-angle.js';

const regex = /^\s*index:/i;
const indexCommand = new Command({
	name: 'Index',
    regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		const content = line.replace(regex, '').trim();
		const indexErr = parseAngle(content);
		if (isNaN(indexErr)) {
			throw new ScriptError('Invalid angle', lineIndex);
		}
		ctx.indexErr = indexErr;
	},
});

export default indexCommand;
