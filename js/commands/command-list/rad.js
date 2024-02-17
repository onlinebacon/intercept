import { toRad } from '../../calc/degrees-radians.js';
import { ScriptError } from '../../errors/script-error.js';
import { ExecutionContext } from '../../script/execution-context.js';
import { parseAngle } from '../../parsers/parse-angle.js';
import { Command } from '../model.js';
import { moveLabel } from '../utils.js';

const regex = /^\s*rad:/i;
const radCommand = new Command({
	name: 'Rad',
	description: `
		Adds a circle of position around the last GP with the specified radius. The argument is the angular value of the circle's radius.
		No correction will be applied.
	`,
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		if (!ctx.gp) {
			throw new ScriptError('No geographical position', lineIndex);
		}
		const content = moveLabel(ctx, line.replace(regex, '').trim());
		const value = parseAngle(content);
		if (isNaN(value)) {
			throw new ScriptError('Invalid radius value', lineIndex);
		}
		ctx.addCoP(toRad(value));
	},
});

export default radCommand;
