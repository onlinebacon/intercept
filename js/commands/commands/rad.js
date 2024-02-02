import { toRad } from '../../degrees-radians.js';
import { ScriptError } from '../../errors/script-error.js';
import { ExecutionContext } from '../../execution-context.js';
import { DistanceLOP } from '../../lop.js';
import { parseAngle } from '../../parse-angle.js';
import { Command } from '../model.js';

const radCommand = new Command({
	name: 'Rad',
	regex: /^\s*rad:/i,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		if (!ctx.gp) {
			throw new ScriptError('No geographical position', lineIndex);
		}
		const content = line.replace(/^\s*rad:/i, '').trim();
		const value = parseAngle(content);
		if (isNaN(value)) {
			throw new ScriptError('Invalid radius value', lineIndex);
		}
		const lop = new DistanceLOP({
			position: ctx.gp.map(toRad),
			value: toRad(value),
		});
		ctx.lops.push(lop);
	},
});

export default radCommand;
