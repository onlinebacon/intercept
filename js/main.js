import './settings/settings.js';
import { run } from './script/run.js';

const input = document.querySelector('.text textarea');

document.querySelector('#calculate').addEventListener('click', () => {
	run(input.value);
});

const initialScript = `

	Date: 2018-11-15
	Index: -0.3'
	Height: 2 m

	Body: dubhe, 08:32:15
	Hs: 55° 18.4'

	Body: arcturus, 08:30:30
	Hs: 27° 9'

	Body: regulus, 08:28:15
	Hs: 70° 48.7'

	Compare: 29 40.5 N, 36 57.0 W

`.trim().split('\n').map(line => line.trim()).join('\n');

input.value = initialScript;

run(input.value);
