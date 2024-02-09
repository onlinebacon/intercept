import { toRad } from '../../degrees-radians.js';
import { ScriptError } from '../../errors/script-error.js';
import { ExecutionContext } from '../../execution-context.js';
import { DistanceLOP } from '../../lop.js';
import { parseAngle } from '../../parse-angle.js';
import { Command } from '../model.js';

const regex = /^\s*rad:/i;
const radCommand = new Command({
	name: 'Rad',
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		if (!ctx.gp) {
			throw new ScriptError('No geographical position', lineIndex);
		}
		const content = line.replace(regex, '').trim();
		const value = parseAngle(content);
		if (isNaN(value)) {
			throw new ScriptError('Invalid radius value', lineIndex);
		}
		ctx.addCoP(toRad(value));
	},
});

export default radCommand;
