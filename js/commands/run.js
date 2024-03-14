import { ScriptError } from '../errors/script-error.js';
import { ExecutionContext } from '../script/execution-context.js';
import * as stdout from '../stdout.js';
import { commandList } from './command-list.js';

export const runCommands = async (ctx = new ExecutionContext(), lines = [ '' ]) => {
	for (let i=0; i<lines.length; ++i) {
		const line = lines[i].replace(/(#|\/\/).*/, '').trim();
		if (line === '') {
			continue;
		}
		const command = commandList.find(command => command.regex.test(line));
		if (!command) {
			stdout.blankLine();
			stdout.writeln('Error at line ', i + 1, ': invalid command line');
			throw new ScriptError('Invalid command line', i);
		}
		try {
			await command.run(ctx, line, i);
		} catch(error) {
			stdout.blankLine();
			if (error instanceof ScriptError) {
				stdout.writeln('Error at line ', i + 1, ': ', error.message);
			} else {
				stdout.writeln('Internal error!');
			}
			throw error;
		}
	}
};
