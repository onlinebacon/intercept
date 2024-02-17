import { EARTH_AV_RAD_METERS } from '../constants.js';

export const calcDip = (h) => {
	const r = 7/6*EARTH_AV_RAD_METERS;
	return Math.acos(r/(r+h))/Math.PI*180;
};
