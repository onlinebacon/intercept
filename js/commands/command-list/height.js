import { ExecutionContext } from '../../script/execution-context.js';
import { ScriptError } from '../../errors/script-error.js';
import { parseHeightMeters } from '../../parsers/parse-height.js';
import { Command } from '../model.js';
import { calcDip } from '../../calc/calc-dip.js';

const heightCommand = new Command({
	name: 'Height',
	regex: /^\s*height:/i,
	description: `
		Sets the observer's height of eye that will be considered for the DIP correction. The default value is zero.
		It requires the suffix with the unit.
	`,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		const content = line.replace(/^\s*height:/i, '').trim();
		const heightMeters = parseHeightMeters(content);
		if (isNaN(heightMeters)) {
			throw new ScriptError('Invalid height', lineIndex);
		}
		const dip = calcDip(heightMeters);
		ctx.dip = dip;
	},
});

export default heightCommand;
