const pressureUnits = [{
	regex: /^inHg$/i,
	toMb: (x) => x*33.8638867,
}, {
	regex: /^Psi$/i,
	toMb: (x) => x*68.9476,
}, {
	regex: /^mb$/i,
	toMb: (x) => x,
}, {
	regex: /^bar$/i,
	toMb: (x) => x*1e3,
}, {
	regex: /^Pa$/i,
	toMb: (x) => x*0.01,
}, {
	regex: /^kPa$/i,
	toMb: (x) => x*10,
}, {
	regex: /^atm$/i,
	toMb: (x) => x*1013.25,
}, {
	regex: /^Torr$/i,
	toMb: (x) => x*0.133322,
}];

const temperatureUnits = [{
	regex: /^(°\s*)?C/i,
	toC: (x) => x,
}, {
	regex: /^(°\s*)?F/i,
	toC: (x) => (x - 32) * (5/9),
}];

const mbPaRatio = 1/100;

const findUnit = (units, str) => {
	return units.find(unit => {
		return unit.regex.test(str);
	}) ?? null;
};

const numberRegex = /^([\+\-]\s*)?\d+(\.\d+)?/;
const unitRegex = /^(°\s*)?\w+/;

const pop = (src, regex) => {
	const match = src.remain.match(regex)?.[0];
	if (match == null) {
		return null;
	}
	src.remain = src.remain.substring(match.length).replace(/^\s+/, '');
	return match;
};

const calcMultiplier = (pressureMb, temperatureC) => {
	const p = pressureMb ?? 1010;
	const t = temperatureC ?? 10;
	return p/1010 * 283/(273 + t);
};

export const parseRefractionMultiplier = (s) => {
	let pressure = null;
	let temperature = null;
	const src = { remain: s };
	while (src.remain !== '') {
		const num = pop(src, numberRegex);
		if (num === null) {
			return null;
		}
		const suffix = pop(src, unitRegex);
		if (suffix === null) {
			return null;
		}
		const pressureUnit = findUnit(pressureUnits, suffix);
		if (pressureUnit !== null) {
			if (pressure !== null) {
				return null;
			}
			pressure = pressureUnit.toMb(Number(num));
			continue;
		}
		const temperatureUnit = findUnit(temperatureUnits, suffix);
		if (temperatureUnit !== null) {
			if (temperature !== null) {
				return null;
			}
			temperature = temperatureUnit.toC(Number(num));
			continue;
		}
	}
	return calcMultiplier(pressure, temperature);
};
