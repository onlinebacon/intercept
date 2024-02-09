import { toRad } from '../../degrees-radians.js';
import { ScriptError } from '../../errors/script-error.js';
import { ExecutionContext } from '../../execution-context.js';
import { parseAngle } from '../../parse-angle.js';
import { Command } from '../model.js';

const regex = /^\s*Az:/i;
const azCommand = new Command({
	name: 'Az',
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		if (!ctx.gp) {
			throw new ScriptError('No geographical position', lineIndex);
		}

		const az = parseAngle(line.replace(regex, ''));
		if (isNaN(az)) {
			throw new ScriptError('Invalid angle', lineIndex);
		}

		ctx.addAzLoP(toRad(az));
	},
});

export default azCommand;
