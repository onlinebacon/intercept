const tan = (deg) => Math.tan(deg*Math.PI/180);
const cot = (deg) => 1 / tan(deg);

export const calcAltStdRefraction = (alt) => {
	if (alt > 89.92) {
		return 0;
	}
	const min = cot(alt + 7.31/(alt + 4.4));
	const deg = min/60;
	return deg;
};
