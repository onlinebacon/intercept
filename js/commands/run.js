import { ScriptError } from '../errors/script-error.js';
import { ExecutionContext } from '../script/execution-context.js';
import heightCommand from './command-list/height.js';
import * as stdout from '../stdout.js';
import gpCommand from './command-list/gp.js';
import radCommand from './command-list/rad.js';
import temperatureCommand from './command-list/temperature.js';
import pressureCommand from './command-list/pressure.js';
import znCommand from './command-list/zn.js';
import hsCommand from './command-list/hs.js';
import azCommand from './command-list/az.js';
import formatCommand from './command-list/format.js';
import compareCommand from './command-list/compare.js';
import indexCommand from './command-list/index.js';
import unitCommand from './command-list/unit.js';

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
