import { calcAzimuth, haversine } from '../lib/js/sphere-math.js';
const { PI } = Math;
const TAU = PI*2;

export class LoP {
	constructor({
		position = [ 0, 0 ],
		value = 0,
	}) {
		this.position = position;
		this.value = value;
	}
	error(coord = [ 0, 0 ]) {
		return 0;
	}
}

export class CoP extends LoP {
	error(coord = [ 0, 0 ]) {
		return haversine(coord, this.position) - this.value;
	}
}

export class AzLoP extends LoP {
	error(coord = [ 0, 0 ]) {
		const diff = calcAzimuth(coord, this.position) - this.value;
		if (diff > PI) {
			return diff - TAU;
		}
		if (diff < - PI) {
			return diff + TAU;
		}
		return diff;
	}
}
