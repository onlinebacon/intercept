const validRegex = /^\d+(\.\d+)?\s*(m|ft)$/;

export const parseHeightMeters = (height) => {
	const trim = height.trim().toLowerCase();
	if (!validRegex.test(trim)) {
		return NaN;
	}
	const [ strNum, unit ] = trim.replace(/([a-z]+)$/, '\x20$1').split(/\s+/);
	const num = Number(strNum);
	if (isNaN(num)) {
		return NaN;
	}
	if (unit === 'm') {
		return num;
	}
	if (unit === 'ft') {
		return num * 0.3048;
	}
	return NaN;
};
