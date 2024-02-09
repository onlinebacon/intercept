import { toDeg } from '../calc/degrees-radians.js';
import { AngleFormatter } from '../lib/js/angle-formatter.js';
import { LatLonFormatter } from '../lib/js/lat-lon-formatter.js';
import { AzLoP, CoP, LoP } from './lop.js';
import { writeln } from '../stdout.js';

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
		writeln('- Added CoP: ', this.radLatLon(this.gp), ', ', this.rad(rad));
		this.lops.push(
			new CoP({
				position: this.gp,
				value: rad,
			}),
		);
		return this;
	}
	addAzLoP(az) {
		writeln('- Added Az LoP: ', this.radLatLon(this.gp), ', ', this.rad(az));
		this.lops.push(
			new AzLoP({
				position: this.gp,
				value: az,
			}),
		);
		return this;
	}
}
