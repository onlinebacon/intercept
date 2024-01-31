import { ScriptError } from '../errors/script-error.js';
import { ExecutionContext } from '../execution-context.js';
import heightCommand from './commands/height.js';
import * as stdout from '../stdout/index.js';
import gpCommand from './commands/gp.js';

export const commands = [
	heightCommand,
	gpCommand,
];

export const run = async (ctx = new ExecutionContext(), lines = [ '' ]) => {
	for (let i=0; i<lines.length; ++i) {
		const line = lines[i].replace(/#.*/, '').trim();
		if (line === '') {
			continue;
		}
		const command = commands.find(command => command.regex.test(line));
		if (!command) {
			stdout.writeln('Error at line ', i + 1, ': invalid command line');
			break;
		}
		try {
			await command.run(ctx, line, i);
		} catch(error) {
			if (error instanceof ScriptError) {
				stdout.writeln('Error at line ', i + 1, ': ', error.message);
				break;
			} else {
				stdout.writeln('Internal error!');
				throw error;
			}
		}
	}
};
