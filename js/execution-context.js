import { AngleFormatter } from './lib/js/angle-formatter.js';

class LOP {
	constructor() {
	}
}

export class ExecutionContext {
	constructor() {
		this.heightMeters = null;
		this.gp = false ? [ 0, 0 ] : null;
		this.angleFormatter = new AngleFormatter().minutes();
	}
	deg(value) {
		return this.angleFormatter.format(value);
	}
}
