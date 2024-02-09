import { calcAltStdRefraction } from '../../calc-alt-refraction.js';
import { toRad } from '../../degrees-radians.js';
import { ScriptError } from '../../errors/script-error.js';
import { ExecutionContext } from '../../execution-context.js';
import { parseAngle } from '../../parse-angle.js';
import { writeln } from '../../stdout/index.js';
import { Command } from '../model.js';

const regex = /^\s*Hs:/i;
const hsCommand = new Command({
	name: 'Hs',
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		if (!ctx.gp) {
			throw new ScriptError('No geographical position', lineIndex);
		}

		const hs = parseAngle(line.replace(regex, ''));
		if (isNaN(hs)) {
			throw new ScriptError('Invalid angle', lineIndex);
		}

		const ha = hs - ctx.indexErr - ctx.dip;
		const ref = calcAltStdRefraction(ha);
		const ho = ha - ref;
		const rad = 90 - ho;
		writeln('Refraction value: ', ctx.deg(ref));

		ctx.addCoP(toRad(rad));
	},
});

export default hsCommand;

