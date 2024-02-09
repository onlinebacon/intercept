import { run } from './commands/index.js';
import { computeIntercept } from './compute-intercept.js';
import { ScriptError } from './errors/script-error.js';
import { ExecutionContext } from './execution-context.js';
import * as stdout from './stdout/index.js';

const input = document.querySelector('.text textarea');

const runScript = async () => {
	stdout.clear();
	const lines = input.value.split('\n');
	const ctx = new ExecutionContext();
	const startTime = Date.now();
	let res;
	try {
		await run(ctx, lines);
		res = await computeIntercept(ctx);
	} catch(err) {
		if (!(err instanceof ScriptError)) {
			console.error(err);
		}
	}
	const endTime = Date.now();
	if (res != null) {
		if (res.length === 1) {
			stdout.writeln('\nResult: ', ctx.latLon(res[0]));
		} else {
			stdout.writeln('\nResults:');
			res.forEach(gp => stdout.writeln('- ', ctx.latLon(gp)));
		}
	}
	stdout.writeln('\nRuntime: ', endTime - startTime, ' ms');
};

document.querySelector('#calculate').addEventListener('click', runScript);
input.addEventListener('input', runScript);

input.value = `

Temperature: 8° F
Pressure: 29 inHg

Height: 6 m

GP: S 63.219265°, W 177.450364°
Zn: 41.029725

GP: S 52.707083°, E 91.161726°
Zn: 20.984725

`.trim();
runScript();
