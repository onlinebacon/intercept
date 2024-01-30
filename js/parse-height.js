const validRegex = /^\d+(\.\d+)?\s*(m|ft)$/;

export const parseHeight = (height) => {
	const trim = height.trim().toLowerCase();
	if (!validRegex.test(trim)) {
		return NaN;
	}
	const [ strNum, unit ] = trim.split(/\s+/);
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
