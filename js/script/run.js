import { comptueError, logLoPErrors, logLoPResiduals } from '../script/analysis.js';
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
		stdout.writeln('Results:');
		results.forEach((gp, i) => {
			stdout.writeln(` ${i + 1}. `, (ctx.compare != null) ?
				`${ctx.radLatLon(gp)} (err: ${comptueError(ctx, gp)})`
			:
				ctx.radLatLon(gp)
			);
		});
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
