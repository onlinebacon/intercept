import { ScriptError } from '../../errors/script-error.js';
import { ExecutionContext } from '../../script/execution-context.js';
import { parseToMb } from '../../parsers/parse-pressure.js';
import { Command } from '../model.js';
import { calcRefMultiplier } from '../../calc/calc-ref-multiplier.js';

const regex = /^\s*pressure:/i;
const pressureCommand = new Command({
	name: 'Pressure',
	description: `
		Sets the pressure that will be considered for the refraction corrections.
		It requires the suffix with the unit. The default value is 1010 mb.
	`,
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		const pressMb = parseToMb(line.replace(regex, ''));
		if (isNaN(pressMb)) {
			throw new ScriptError('Invalid pressure value', lineIndex);
		}
		ctx.pressMb = pressMb;
		ctx.refMul = calcRefMultiplier(ctx.tempC, pressMb);
	},
});

export default pressureCommand;
