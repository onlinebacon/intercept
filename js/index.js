import { run } from './commands/index.js';
import { ExecutionContext } from './execution-context.js';
import * as stdout from './stdout/index.js';

const input = document.querySelector('.text textarea');

const runScript = async () => {
	stdout.clear();
	const lines = input.value.split('\n');
	const ctx = new ExecutionContext();
	await run(ctx, lines);
};

document.querySelector('#calculate').addEventListener('click', runScript);
input.addEventListener('input', runScript);

input.value = `

Height: 60ft
GP: 32 N, 42 W

`.trim();
runScript();
