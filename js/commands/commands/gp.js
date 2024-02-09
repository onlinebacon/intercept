import { ExecutionContext } from '../../execution-context.js';
import { ScriptError } from '../../errors/script-error.js';
import { Command } from '../model.js';
import { parseLatLon } from '../../lib/js/parse-lat-lon.js';
import { writeln } from '../../stdout/index.js';
import { toRad } from '../../degrees-radians.js';

const regex = /^\s*gp:/i;
const gpCommand = new Command({
	name: 'GP',
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		const content = line.replace(regex, '').trim();
		const gp = parseLatLon(content);
		if (!gp) {
			throw new ScriptError('Invalid GP', lineIndex);
		}
		ctx.gp = gp.map(toRad);
		writeln(`\nGP: ${ctx.latLon(gp)}`);
	},
});

export default gpCommand;
