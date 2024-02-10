import { ScriptError } from '../errors/script-error.js';
import { ExecutionContext } from '../script/execution-context.js';
import heightCommand from './commands/height.js';
import * as stdout from '../stdout.js';
import gpCommand from './commands/gp.js';
import radCommand from './commands/rad.js';
import temperatureCommand from './commands/temperature.js';
import pressureCommand from './commands/pressure.js';
import znCommand from './commands/zn.js';
import hsCommand from './commands/hs.js';
import azCommand from './commands/az.js';
import formatCommand from './commands/format.js';
import compareCommand from './commands/compare.js';
import indexCommand from './commands/index.js';
import unitCommand from './commands/unit.js';

export const commands = [
	heightCommand,
	temperatureCommand,
	pressureCommand,
	unitCommand,
	gpCommand,
	radCommand,
	znCommand,
	hsCommand,
	azCommand,
	formatCommand,
	compareCommand,
	indexCommand,
];

export const runCommands = async (ctx = new ExecutionContext(), lines = [ '' ]) => {
	for (let i=0; i<lines.length; ++i) {
		const line = lines[i].replace(/(#|\/\/).*/, '').trim();
		if (line === '') {
			continue;
		}
		const command = commands.find(command => command.regex.test(line));
		if (!command) {
			stdout.writeln('Error at line ', i + 1, ': invalid command line');
			throw new ScriptError('Invalid command line', i);
		}
		try {
			await command.run(ctx, line, i);
		} catch(error) {
			if (error instanceof ScriptError) {
				stdout.writeln('Error at line ', i + 1, ': ', error.message);
			} else {
				stdout.writeln('Internal error!');
			}
			throw error;
		}
	}
};
