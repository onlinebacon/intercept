import {
	AUTO_RUN,
	CORRECTIONS,
	GP_CALC,
	LOP_ERRORS,
	LOP_RESIDUALS,
	RUNTIME,

	flagOn,
	setFlag,
	storeFlags,
} from '../flags/flags.js';

const toggles = [{
	flag: CORRECTIONS, label: 'Show corrections',
},  {
	flag: GP_CALC, label: 'Show GP calculations',
},  {
	flag: LOP_RESIDUALS, label: 'Show LoP residuals',
},  {
	flag: LOP_ERRORS, label: 'Show LoP errors',
},  {
	flag: RUNTIME, label: 'Show run time',
},  {
	flag: AUTO_RUN, label: 'Auto run',
}];

const bg = document.querySelector('.settings-background');
const togglesDOM = document.querySelector('.toggles');

bg.addEventListener('click', e => {
	const target = e.target;
	if (target === bg) {
		bg.style.display = 'none';
	}
});

export const open = () => {
	bg.style.display = 'block';
};

for (const { label, flag } of toggles) {
	const toggle = document.createElement('div');
	const labelDOM = document.createElement('div');
	const button = document.createElement('button');
	toggle.setAttribute('class', 'toggle');
	button.setAttribute('value', flagOn(flag) ? 'on' : 'off');
	labelDOM.setAttribute('class', 'toggle-label');
	labelDOM.innerText = label;
	toggle.appendChild(button);
	toggle.appendChild(labelDOM);
	togglesDOM.appendChild(toggle);
	button.addEventListener('click', () => {
		const value = button.getAttribute('value');
		if (value === 'off') {
			button.setAttribute('value', 'on');
			setFlag(flag, true);
		} else {
			button.setAttribute('value', 'off');
			setFlag(flag, false);
		}
		storeFlags();
	});
}

document.querySelector('#settings').addEventListener('click', open);
