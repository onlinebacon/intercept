import { ScriptError } from '../../errors/script-error.js';
import { ExecutionContext } from '../../execution-context.js';
import { Command } from '../model.js';

const regex = /^\s*Format:/i;
const pattern = /^(\.0*1\s*)?(deg|min|sec)$/i;
const typeRegex = /[a-z]+$/i;
const radCommand = new Command({
	name: 'Format',
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		let figures = 0;
		const content = line.replace(regex, '').trim();
		if (!pattern.test(content)) {
			throw new ScriptError('Invalid format syntax');
		}
		const type = content.match(typeRegex)[0].trim();
		const remain = content.replace(typeRegex, '').trim();
		if (remain !== null) {
			figures = remain.length - 1;
		}
		if (type === 'deg') {
			ctx.angleFormatter = ctx.angleFormatter.decimals().figures(figures);
		}
		if (type === 'min') {
			ctx.angleFormatter = ctx.angleFormatter.minutes().figures(figures);
		}
		if (type === 'sec') {
			ctx.angleFormatter = ctx.angleFormatter.seconds().figures(figures);
		}
	},
});

export default radCommand;
