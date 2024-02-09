import { toDeg, toRad } from './degrees-radians.js';
import { AngleFormatter } from './lib/js/angle-formatter.js';
import { LatLonFormatter } from './lib/js/lat-lon-formatter.js';
import { DistanceLOP, LOP } from './lop.js';
import { write, writeln } from './stdout/index.js';

export class ExecutionContext {
	constructor() {
		this.dip = null;
		this.gp = false ? [ 0, 0 ] : null;
		this.angleFormatter = new AngleFormatter().minutes();
		this.indexErr = 0;
		this.lops = false ? [ new LOP() ] : [];
		this.pressMb = 1010;
		this.tempCelsius = 10;
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
		return this.latLon(latLon.map(toRad));
	}
	addCoP(rad) {
		writeln('- Added CoP: ', this.radLatLon(this.gp), ', ', this.rad(rad));
		this.lops.push(
			new DistanceLOP({
				position: this.gp,
				value: rad,
			}),
		);
		return this;
	}
}
