const tan = (deg) => Math.tan(deg*Math.PI/180);
const cot = (deg) => 1 / tan(deg);

export const calcAltStdRefraction = (alt) => {
	return cot(alt + 7.31/(alt + 4.4)) / 60;
};
