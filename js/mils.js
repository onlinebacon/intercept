const formatRegex = /\d+(\.\d+)?\s*Mils?/i;

export const isMilsFormat = (str) => {
	return formatRegex.test(str);
};

export const parseMils = (str) => {
	return Number(str.replace(/Mils?$/, '')) / 6400 * 360;
};
