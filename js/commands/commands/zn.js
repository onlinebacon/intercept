import { calcAltStdRefraction } from '../../calc-alt-refraction.js';
import { toRad } from '../../degrees-radians.js';
import { ScriptError } from '../../errors/script-error.js';
import { ExecutionContext } from '../../execution-context.js';
import { parseAngle } from '../../parse-angle.js';
import { writeln } from '../../stdout/index.js';
import { Command } from '../model.js';

const regex = /^\s*Zn:/i;
const znCommand = new Command({
	name: 'Zn',
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		if (!ctx.gp) {
			throw new ScriptError('No geographical position', lineIndex);
		}

		const zn = parseAngle(line.replace(regex, ''));
		if (isNaN(zn)) {
			throw new ScriptError('Invalid zenith angle', lineIndex);
		}

		const alt = 90 - (zn - ctx.indexErr);
		const mul = ctx.pressMb/1010 * 283/(273 + ctx.tempCelsius);
		const ref = calcAltStdRefraction(alt) * mul;
		writeln('Refraction value: ', ctx.deg(ref));

		const rad = toRad(90 - (alt - ref));
		ctx.addCoP(rad);
	},
});

export default znCommand;
