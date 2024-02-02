import { AngleFormatter } from './lib/js/angle-formatter.js';
import { LOP } from './lop.js';

export class ExecutionContext {
	constructor() {
		this.heightMeters = null;
		this.gp = false ? [ 0, 0 ] : null;
		this.gpText = null;
		this.angleFormatter = new AngleFormatter().minutes();
		this.lops = false ? [ new LOP() ] : [];
	}
	deg(value) {
		return this.angleFormatter.format(value);
	}
}
