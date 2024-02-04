const regex = {
	celsius: /(°\s*)?C\s*$/i,
	fahrenheit: /(°\s*)?F\s*$/i,
};

const parseCelsius = (str) => {
	const number = str.trim().replace(regex.celsius, '').trim();
	return Number(number);
};

const parseFahrenheit = (str) => {
	const number = str.trim().replace(regex.fahrenheit, '').trim();
	return Number(number);
};

const fToC = (f) => (f - 32)*5/9;

export const parseToCelsius = (str) => {
	if (regex.celsius.test(str)) {
		return parseCelsius(str);
	}
	if (regex.fahrenheit.test(str)) {
		const f = parseFahrenheit(str);
		return fToC(f);
	}
	return NaN;
};
