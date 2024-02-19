import { ExecutionContext } from '../../script/execution-context.js';
import { ScriptError } from '../../errors/script-error.js';
import { Command } from '../model.js';
import { buildHybridFn, buildMinSqrFn, buildMinSumFn } from '../../script/min-methods.js';

const map = {
	'min-sqr': buildMinSqrFn,
	'min-sum': buildMinSumFn,
	'hybrid':  buildHybridFn,
};

const regex = /^\s*method:/i;
const methodCommand = new Command({
	name: 'Method',
	description: `
		Sets the method for the error minimization. The default method is "min-sqr" (minimum squares).
		Accepted methods: min-sqr, min-sum and hybrid
	`,
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		const content = line.replace(regex, '').trim().toLowerCase();
		const fnBuilder = map[content];
		if (!fnBuilder) {
			throw new ScriptError(`Invalid method`, lineIndex);
		}
		ctx.fnBuilder = fnBuilder;
	},
});

export default methodCommand;
