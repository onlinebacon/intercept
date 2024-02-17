export const calcRefMultiplier = (tempC = 10, pressMb = 1010) => {
	return pressMb/1010 * 283/(273 + tempC);
};
