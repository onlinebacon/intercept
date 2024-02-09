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

export const parseToMb = (str) => {
	const trimmed = str.trim();
	const suffix = trimmed.match(/[a-z]+$/i)?.[0];
	if (!suffix) {
		return NaN;
	}
	const unit = pressureUnits.find(unit => unit.regex.test(suffix));
	if (!unit) {
		return NaN;
	}
	const raw = Number(trimmed.replace(/\s*[a-z]+$/i, ''));
	return unit.toMb(raw);
};
