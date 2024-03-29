import { computeError, logLoPErrors, logLoPResiduals } from '../script/analysis.js';
import { runCommands } from '../commands/run.js';
import { computeIntercept } from './compute-intercept.js';
import { ScriptError } from '../errors/script-error.js';
import { ExecutionContext } from './execution-context.js';
import * as stdout from '../stdout.js';
import { LOP_ERRORS, LOP_RESIDUALS, RUNTIME, flagOn } from '../flags/flags.js';

const REQ_DELAY = 750;

let running = false;
let runAgain = false;
let runReq = null;

export const run = async (script) => {
	running = true;
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
		stdout.blankLine();
		stdout.writeln('Results:');
		results.forEach((gp, i) => {
			stdout.writeln(i + 1, '. ', (ctx.compare != null) ?
				`${ctx.radLatLon(gp)} (err: ${computeError(ctx, gp)})`
			:
				ctx.radLatLon(gp)
			);
		});
		if (flagOn(LOP_RESIDUALS)) {
			stdout.blankLine();
			logLoPResiduals(ctx);
		}
		if (ctx.compare != null && flagOn(LOP_ERRORS)) {
			stdout.blankLine();
			logLoPErrors(ctx);
		}
	}
	if (flagOn(RUNTIME)) {
		stdout.blankLine();
		stdout.writeln('Runtime: ', endTime - startTime, ' ms');
	}
	running = false;
	if (runAgain !== false) {
		runAgain = false;
		run(runAgain);
	}
};

export const runRequest = (script) => {
	if (runReq !== null) {
		clearTimeout(runReq);
	}
	runReq = setTimeout(() => {
		runReq = null;
		if (running) {
			runAgain = script;
		} else {
			run(script);
		}
	}, REQ_DELAY);
};
