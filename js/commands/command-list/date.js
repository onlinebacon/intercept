import { ExecutionContext } from '../../script/execution-context.js';
import { ScriptError } from '../../errors/script-error.js';
import { Command } from '../model.js';
import { parseDate } from '../../parsers/parse-date.js';

const regex = /^\s*date:/i;
const dateCommand = new Command({
	name: 'Date',
    regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		const content = line.replace(regex, '').trim();
		const parsed = parseDate(content);
		if (parsed == null) {
			return new ScriptError(`Invalid date format`, lineIndex);
		}
		ctx.date = parsed;
	},
});

export default dateCommand;
