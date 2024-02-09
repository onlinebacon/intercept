import { ScriptError } from '../../errors/script-error.js';
import { ExecutionContext } from '../../script/execution-context.js';
import { Command } from '../model.js';

const regex = /^\s*format:/i;
const pattern = /^(\.0*1\s*)?(deg|min|sec)$/i;
const typeRegex = /[a-z]+$/i;
const formatCommand = new Command({
	name: 'Format',
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		let figures = 0;
		const content = line.replace(regex, '').trim();
		if (!pattern.test(content)) {
			throw new ScriptError('Invalid format syntax');
		}
		const type = content.match(typeRegex)[0].trim().toLowerCase();
		const remain = content.replace(typeRegex, '').trim();
		if (remain !== '') {
			figures = remain.length - 1;
		}
		if (type === 'deg') {
			ctx.angleFormatter = ctx.angleFormatter.decimals().withFigures(figures);
		}
		if (type === 'min') {
			ctx.angleFormatter = ctx.angleFormatter.minutes().withFigures(figures);
		}
		if (type === 'sec') {
			ctx.angleFormatter = ctx.angleFormatter.seconds().withFigures(figures);
		}
	},
});

export default formatCommand;
