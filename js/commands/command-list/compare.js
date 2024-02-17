import { ExecutionContext } from '../../script/execution-context.js';
import { ScriptError } from '../../errors/script-error.js';
import { Command } from '../model.js';
import { parseLatLon } from '../../lib/js/parse-lat-lon.js';
import { toRad } from '../../calc/degrees-radians.js';

const regex = /^\s*compare:/i;
const compareCommand = new Command({
	name: 'Compare',
	description: `
		Defines a geographical position to be considered the correct one. This allows errors to be computed and logged in the console.
	`,
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		const content = line.replace(regex, '').trim();
		const gp = parseLatLon(content);
		if (!gp) {
			throw new ScriptError('Invalid GP', lineIndex);
		}
		ctx.compare = gp.map(toRad);
	},
});

export default compareCommand;
