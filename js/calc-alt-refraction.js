const tan = (deg) => Math.tan(deg*Math.PI/180);
const cot = (deg) => 1 / tan(deg);

export const calcAltStdRefraction = (alt) => {
	const min = cot(alt + 7.31/(alt + 4.4));
	const deg = min/60;
	const rad = deg/180*Math.PI;
	return rad;
};
