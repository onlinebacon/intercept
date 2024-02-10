import { logError, logLoPErrors, logLoPResiduals } from '../script/analysis.js';
import { runCommands } from '../commands/index.js';
import { computeIntercept } from './compute-intercept.js';
import { ScriptError } from '../errors/script-error.js';
import { ExecutionContext } from './execution-context.js';
import * as stdout from '../stdout.js';

export const run = async (script) => {
	stdout.clear();
	const lines = script.split('\n');
	const ctx = new ExecutionContext();
	const startTime = Date.now();
	try {
		await runCommands(ctx, lines);
		await computeIntercept(ctx);
	} catch(err) {
		if (!(err instanceof ScriptError)) {
			console.error(err);
		}
	}
	const endTime = Date.now();
	const { results } = ctx;
	if (results != null) {
		if (results.length === 1) {
			stdout.writeln('Result: ', ctx.radLatLon(results[0]));
		} else {
			stdout.writeln('Results:');
			results.forEach(gp => stdout.writeln('- ', ctx.radLatLon(gp)));
		}
		if (ctx.compare != null) {
			logError(ctx);
		}
		stdout.writeln('');
		logLoPResiduals(ctx);
		if (ctx.compare != null) {
			stdout.writeln('');
			logLoPErrors(ctx);
		}
	}
	stdout.writeln();
	stdout.writeln('Runtime: ', endTime - startTime, ' ms');
	localStorage?.setItem('script', script);
};
