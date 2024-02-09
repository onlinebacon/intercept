import { ScriptError } from '../../errors/script-error.js';
import { ExecutionContext } from '../../execution-context.js';
import { parseToMb } from '../../parse-pressure.js';
import { Command } from '../model.js';

const regex = /^\s*pressure:/i;
const pressureCommand = new Command({
	name: 'Pressure',
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		const pressMb = parseToMb(line.replace(regex, ''));
		if (isNaN(pressMb)) {
			throw new ScriptError('Invalid pressure value', lineIndex);
		}
		ctx.pressMb = pressMb;
	},
});

export default pressureCommand;
