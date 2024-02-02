import { run } from './commands/index.js';
import { computeIntercept } from './compute-intercept.js';
import { ExecutionContext } from './execution-context.js';
import { LatLonFormatter } from './lib/js/lat-lon-formatter.js';
import * as stdout from './stdout/index.js';

const input = document.querySelector('.text textarea');

const runScript = async () => {
	stdout.clear();
	const lines = input.value.split('\n');
	const ctx = new ExecutionContext();
	const startTime = Date.now();
	await run(ctx, lines);
	const res = await computeIntercept(ctx);
	const endTime = Date.now();
	stdout.writeln('Result: ', new LatLonFormatter(ctx.angleFormatter).format(res));
	stdout.writeln('Runtime: ', endTime - startTime, ' ms');
};

document.querySelector('#calculate').addEventListener('click', runScript);
input.addEventListener('input', runScript);

input.value = `

Height: 60ft

GP: 32 N, 42 W
Rad: 100

`.trim();
runScript();
