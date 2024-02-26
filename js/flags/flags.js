export const LOP_RESIDUALS = 'RES_RESIDUALS';
export const LOP_ERRORS    = 'RES_ERRORS';
export const CORRECTIONS   = 'CORRECTIONS';
export const GP_CALC       = 'GP_CALC';
export const RUNTIME       = 'RUNTIME';

const flags = {
	[CORRECTIONS]: true,
	[GP_CALC]: true,
	[LOP_RESIDUALS]: false,
	[LOP_ERRORS]: false,
	[RUNTIME]: false,
};

export const flagOn = (flag) => {
	return flags[flag];
};

const loadFlags = () => {
	const json = localStorage?.getItem('flags');
	if (!json) {
		return;
	}
	const map = JSON.parse(json);
	for (const key in map) {
		if (flags[map] !== undefined) {
			flags[map] = key[map];
		}
	}
};

export const storeFlags = () => {
	const json = JSON.stringify(flags);
	localStorage?.setItem('flags', json);
};

loadFlags();
