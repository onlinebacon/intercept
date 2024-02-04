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
	let res = undefined;
	try {
		await run(ctx, lines);
		res = await computeIntercept(ctx);
	} catch(err) {
		console.error(err);
	}
	const endTime = Date.now();
	if (res !== undefined) {
		stdout.writeln('Result: ', new LatLonFormatter(ctx.angleFormatter).format(res));
	}
	stdout.writeln('Runtime: ', endTime - startTime, ' ms');
	console.log(ctx);
};

document.querySelector('#calculate').addEventListener('click', runScript);
input.addEventListener('input', runScript);

input.value = `

Height: 6 m

GP: S 63.219265°, W 177.450364°
Rad: 41.029725

GP: S 52.707083°, E 91.161726°
Rad: 20.984725

Temperature: 8° F
Pressure: 29 inHg

`.trim();
runScript();
