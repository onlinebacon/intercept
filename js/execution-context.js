import { toDeg } from './degrees-radians.js';
import { AngleFormatter } from './lib/js/angle-formatter.js';
import { LOP } from './lop.js';

export class ExecutionContext {
	constructor() {
		this.dip = null;
		this.gp = false ? [ 0, 0 ] : null;
		this.angleFormatter = new AngleFormatter().minutes();
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
}
