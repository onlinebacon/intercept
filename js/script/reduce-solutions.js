import { haversine } from '../lib/js/sphere-math.js';

const DEG = Math.PI/180;
const ARCMIN = DEG/60;
const ARCSEC = ARCMIN/60;

const removeDoublePair = (minimizers, distance) => {
	const n = minimizers.length;
	let ia, ib, abDist;
	for (let i=1; i<n; i++) {
		const b = minimizers[i];
		for (let j=0; j<i; ++j) {
			const a = minimizers[j];
			const dist = haversine(a.coord, b.coord);
			if (dist < distance && (abDist == null || dist < abDist)) {
				abDist = dist;
				ia = i;
				ib = j;
			}
		}
	}
	if (abDist == null) {
		return false;
	}
	if (minimizers[ia].value > minimizers[ib].value) {
		minimizers.splice(ia, 1);
	} else {
		minimizers.splice(ib, 1);
	}
	return true;
};

export const removeDoubles = (minimizers, distance = 0.1*ARCSEC) => {
	while (minimizers.length > 1) {
		const removed = removeDoublePair(minimizers, distance);
		if (!removed) {
			break;
		}
	}
	return minimizers;
};

export const removeBadResults = (minimizers, minErr = ARCSEC, minRatio = 4) => {
	minimizers.sort((a, b) => a.value - b.value);
	const bestErr = minimizers[0].value;
	while (minimizers.length > 1) {
		const err = minimizers.at(-1).value;
		if (err < minErr) {
			break;
		}
		if (err/bestErr < minRatio) {
			break;
		}
		minimizers.length --;
	}
	return minimizers;
};
