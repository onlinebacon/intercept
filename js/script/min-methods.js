export const buildMinSqrFn = (lops) => {
	return (coord) => {
		const n = lops.length;
		let sum = 0;
		for (let i=0; i<n; ++i) {
			sum += lops[i].error(coord) ** 2;
		}
		return sum;
	};
};

export const buildMinSumFn = (lops) => {
	return (coord) => {
		const n = lops.length;
		let sum = 0;
		for (let i=0; i<n; ++i) {
			sum += Math.abs(lops[i].error(coord));
		}
		return sum;
	};
};

export const buildHybridFn = (lops) => {
	return (coord) => {
		const n = lops.length;
		let sum = 0;
		for (let i=0; i<n; ++i) {
			sum += Math.abs(lops[i].error(coord)) ** 1.5;
		}
		return sum;
	};
};
