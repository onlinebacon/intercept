import { calcAltStdRefraction } from '../../calc/calc-alt-refraction.js';
import { toRad } from '../../calc/degrees-radians.js';
import { ScriptError } from '../../errors/script-error.js';
import { ExecutionContext } from '../../script/execution-context.js';
import { parseAngle } from '../../parsers/parse-angle.js';
import { Command } from '../model.js';
import { moveLabel } from '../utils.js';
import { CORRECTIONS, flagOn } from '../../flags/flags.js';
import { blankLine, writeln } from '../../stdout.js';

const regex = /^\s*Zen:/i;
const zenCommand = new Command({
	name: 'Zen',
	description: `
		Specifies a zenith angle reading. Corrections will applied so this angle reading can result in a radius of a new circle of position.
	`,
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		if (!ctx.gp) {
			throw new ScriptError('No geographical position', lineIndex);
		}
	
		line = moveLabel(ctx, line);

		const zen = parseAngle(line.replace(regex, ''));
		if (isNaN(zen)) {
			throw new ScriptError('Invalid zenith angle', lineIndex);
		}

		const alt = 90 - (zen - ctx.indexErr);
		const ref = calcAltStdRefraction(alt) * ctx.refMul;
		const rad = 90 - (alt - ref);

		if (flagOn(CORRECTIONS)) {
			blankLine();
			writeln(`Zenith of ${ctx.deg(zen)}:`);
			writeln('- Corrected for index: ', ctx.deg(90 - alt));
			writeln('- Refraction: ', ctx.deg(ref));
			writeln('- Zenith distance: ', ctx.deg(rad));
		}

		ctx.addCoP(toRad(rad));
	},
});

export default zenCommand;
