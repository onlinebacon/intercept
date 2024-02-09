import { run } from './script/run.js';

const input = document.querySelector('.text textarea');

document.querySelector('#calculate').addEventListener('click', () => {
	run(input.value);
});

input.addEventListener('input', () => {
	run(input.value);
});

const initialScript = localStorage?.getItem('script') ?? `

	Format: Sec
	Temperature: 8° F
	Pressure: 29 inHg

	Height: 6 m

	GP: S 63.219265°, W 177.450364°
	Zn: 41.029725 (Zn to random star)
	Az: 223.316736

	GP: S 52.707083°, E 91.161726°
	Hs: 20.984725

`.trim().split('\n').map(line => line.trim()).join('\n');

input.value = initialScript;

run(input.value);
