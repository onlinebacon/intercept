import { ExecutionContext } from '../../script/execution-context.js';
import { ScriptError } from '../../errors/script-error.js';
import { Command } from '../model.js';
import { parseLatLon } from '../../lib/js/parse-lat-lon.js';
import { toRad } from '../../calc/degrees-radians.js';

const regex = /^\s*gp:/i;
const gpCommand = new Command({
	name: 'GP',
	description: `
		Sets a geographical position for the next lines of position to reference.
		Accepted format: latitude (deg), longitude (deg)
	`,
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		const content = line.replace(regex, '').trim();
		const gp = parseLatLon(content);
		if (!gp) {
			throw new ScriptError('Invalid GP', lineIndex);
		}
		ctx.gp = gp.map(toRad);
	},
});

export default gpCommand;
