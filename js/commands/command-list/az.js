import { toRad } from '../../calc/degrees-radians.js';
import { ScriptError } from '../../errors/script-error.js';
import { ExecutionContext } from '../../script/execution-context.js';
import { parseAngle } from '../../parsers/parse-angle.js';
import { Command } from '../model.js';
import { moveLabel } from '../utils.js';

const regex = /^\s*Az:/i;
const azCommand = new Command({
	name: 'Az',
	description: `
		Speicifes an azimuth angle reading to the last GP to add a new corresponding line of position.
	`,
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		if (!ctx.gp) {
			throw new ScriptError('No geographical position', lineIndex);
		}

		line = moveLabel(ctx, line);

		const az = parseAngle(line.replace(regex, ''));
		if (isNaN(az)) {
			throw new ScriptError('Invalid angle', lineIndex);
		}

		ctx.addAzLoP(toRad(az));
	},
});

export default azCommand;
