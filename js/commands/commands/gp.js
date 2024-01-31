import { ExecutionContext } from '../../execution-context.js';
import { ScriptError } from '../../errors/script-error.js';
import { Command } from '../model.js';
import { parseLatLon } from '../../lib/js/parse-lat-lon.js';
import * as stdout from '../../stdout/index.js';

const gpCommand = new Command({
	name: 'GP',
	description: 'Sets the geographical position',
	regex: /^\s*gp:/i,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		const content = line.replace(/^\s*gp:/i, '').trim();
		const gp = parseLatLon(content);
		if (!gp) {
			throw new ScriptError('Invalid GP', lineIndex);
		}
		ctx.gp = gp;
		stdout.writeln(`GP = ${content}`);
	},
});

export default gpCommand;
