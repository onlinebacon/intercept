import { parseDegree } from './lib/js/parse-degree.js';

const milSuffix = /mils?$/i;

export const parseAngle = (text) => {
	if (milSuffix.test(text)) {
		const raw = Number(text.replace(milSuffix, ''));
		return raw / 6400 * 360;
	}
	return parseDegree(text);
};
