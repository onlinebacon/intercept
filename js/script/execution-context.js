import { toDeg } from '../calc/degrees-radians.js';
import { AngleFormatter } from '../lib/js/angle-formatter.js';
import { LatLonFormatter } from '../lib/js/lat-lon-formatter.js';
import { AzLoP, CoP, LoP } from './lop.js';
import { NAUTICAL_MILE } from '../lib/js/length-units.js';

export class ExecutionContext {
	constructor() {
		this.dip = null;
		this.gp = false ? [ 0, 0 ] : null;
		this.angleFormatter = new AngleFormatter().minutes();
		this.indexErr = 0;
		this.lops = false ? [ new LoP() ] : [];
		this.pressMb = 1010;
		this.tempCelsius = 10;
		this.labels = [];
		this.results = false ? [[ 0, 0 ]] : null;
		this.compare = false ? [ 0, 0 ] : null;
		this.lenUnit = NAUTICAL_MILE;
		this.date = null;
		this.gmtOffset = '+0000';
	}
	deg(value) {
		return this.angleFormatter.format(value);
	}
	rad(value) {
		return this.angleFormatter.format(toDeg(value));
	}
	latLon(latLon) {
		return new LatLonFormatter(this.angleFormatter).format(latLon);
	}
	radLatLon(latLon) {
		return this.latLon(latLon.map(toDeg));
	}
	addCoP(rad) {
		this.lops.push(
			new CoP({
				position: this.gp,
				value: rad,
			}),
		);
		return this;
	}
	addAzLoP(az) {
		this.lops.push(
			new AzLoP({
				position: this.gp,
				value: az,
			}),
		);
		return this;
	}
}
