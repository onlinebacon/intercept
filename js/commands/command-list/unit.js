import { ScriptError } from '../../errors/script-error.js';
import { find } from '../../lib/js/length-units.js';
import { ExecutionContext } from '../../script/execution-context.js';
import { Command } from '../model.js';

const regex = /^\s*unit:/i;
const unitCommand = new Command({
	name: 'Unit',
	description: `
		Sets the unit for outputting distance values.
	`,
	regex,
	run: (ctx = new ExecutionContext(), line, lineIndex) => {
		const content = line.replace(regex, '').replace(/\s+/, '\x20').trim();
		const unit = find(content);
		if (!unit) {
			throw new ScriptError('Invalid unit', lineIndex);
		}
		ctx.lenUnit = unit;
	},
});

export default unitCommand;
