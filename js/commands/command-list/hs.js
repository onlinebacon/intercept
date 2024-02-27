import { calcAltStdRefraction } from '../../calc/calc-alt-refraction.js';
import { toRad } from '../../calc/degrees-radians.js';
import { ScriptError } from '../../errors/script-error.js';
import { ExecutionContext } from '../../script/execution-context.js';
import { parseAngle } from '../../parsers/parse-angle.js';
import { Command } from '../model.js';
import { moveLabel } from '../utils.js';
import { CORRECTIONS, flagOn } from '../../flags/flags.js';
import { blankLine, write, writeln } from '../../stdout.js';

const regex = /^\s*Hs:/i;
const hsCommand = new Command({
	name: 'Hs',
	description: `
		Specifices a height of sextant reading. All the standard sextant corrections will be applied to add a new circle of position to the set.
	`,
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		if (!ctx.gp) {
			throw new ScriptError('No geographical position', lineIndex);
		}

		line = moveLabel(ctx, line);

		const hs = parseAngle(line.replace(regex, ''));
		if (isNaN(hs)) {
			throw new ScriptError('Invalid angle', lineIndex);
		}

		const ha = hs - ctx.indexErr - ctx.dip;
		const ref = calcAltStdRefraction(ha)*ctx.refMul;
		const ho = ha - ref;
		const rad = 90 - ho;

		if (flagOn(CORRECTIONS)) {
			blankLine();
			writeln('Hs of ', ctx.deg(hs), ':');
			writeln('- Ha: ', ctx.deg(ha));
			writeln('- Refraction: ', ctx.deg(ref));
			writeln('- Ho: ', ctx.deg(ho));
			writeln('- Zenith distance: ', ctx.deg(rad));
		}

		ctx.addCoP(toRad(rad));
	},
});

export default hsCommand;

