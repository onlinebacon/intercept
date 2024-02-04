import { ExecutionContext } from '../../execution-context.js';
import { ScriptError } from '../../errors/script-error.js';
import { parseHeightMeters } from '../../parse-height.js';
import { Command } from '../model.js';
import * as stdout from '../../stdout/index.js';
import { calcDip } from '../../calc-dip.js';

const heightCommand = new Command({
	name: 'Height',
	regex: /^\s*height:/i,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		const content = line.replace(/^\s*height:/i, '').trim();
		const heightMeters = parseHeightMeters(content);
		if (isNaN(heightMeters)) {
			throw new ScriptError('Invalid height', lineIndex);
		}
		const dip = calcDip(heightMeters);
		stdout.writeln(`Dip for height of ${content}: ${ctx.rad(dip)}`);
		ctx.dip = dip;
	},
});

export default heightCommand;
