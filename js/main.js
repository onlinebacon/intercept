import './settings/settings.js';
import { run, runRequest } from './script/run.js';
import { AUTO_RUN, flagOn } from './flags/flags.js';

const input = document.querySelector('.text textarea');

document.querySelector('#calculate').addEventListener('click', () => {
	run(input.value);
});

const initialScript = `

	Date: Nov 15th, 2018
	Index: -0.3'
	Height: 2 m
	Zone: UTC-5

	Body: dubhe, 03:32:15
	Hs: 55° 18.4'

	Body: arcturus, 03:30:30
	Hs: 27° 9'

	Body: regulus, 03:28:15
	Hs: 70° 48.7'

	Compare: 29 40.5 N, 36 57.0 W

`.trim().split('\n').map(line => line.trim()).join('\n');

input.value = initialScript;
input.addEventListener('input', () => {
	if (flagOn(AUTO_RUN)) {
		runRequest(input.value);
	}
});

run(input.value);
