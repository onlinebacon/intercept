import { icosahedronCoords } from './lib/js/icosahedron-coords.js';
import { parseDegree } from './lib/js/parse-degree.js';
import { parseLatLon } from './lib/js/parse-lat-lon.js';
import * as S from './lib/js/sphere-math.js';
import { SphericalMinimizer } from './lib/js/spherical-minimizer.js';
import { D180, D360, DEG } from './lib/js/trig.js';

const input = document.querySelector('.text textarea');
const output = document.querySelector('.logs textarea');
const commands = [];

const write = (...values) => {
	output.value += values.join('') + '\n';
};

const AZM_LOP = 0x1;
const COP = 0x2;

class ScriptError extends Error {
	constructor(message, lineIndex) {
		super(message);
		this.lineIndex = lineIndex;
	}
}

const angleDif = (target, reference) => {
	const rawDif = (target - reference)%D360;
	if (rawDif > D180) {
		return rawDif - D360;
	}
	if (rawDif < -D180) {
		return rawDif + D360;
	}
	return rawDif;
};

const formatAngle = (angle) => {
	return angle.toFixed(6)*1 + '';
};

const formatCoord = (coord) => {
	return coord.map(val => formatAngle(val/DEG)).join(', ');
};

const finish = (ctx) => {
	const minimizers = icosahedronCoords.map(coord => {
		const fn = (coord) => {
			let sum = 0;
			for (const { center, radius } of ctx.radLOP) {
				const err = S.haversine(coord, center) - radius;
				sum += err**2;
			}
			for (const { center, azm } of ctx.azmLOP) {
				const err = angleDif(azm, S.calcAzimuth(coord, center));
				sum += (err >= D180 ? D360 - err : err)**2;
			}
			return sum;
		};
		return new SphericalMinimizer({ coord, fn });
	});
	for (let i=0; i<1000; ++i) {
		minimizers.forEach(min => min.iterate());
	}
	minimizers.sort((a, b) => a.value - b.value);
	const res = minimizers[0].coord;
	write('Result: ', formatCoord(res));
	if (ctx.cmp != null) {
		write('Error:');
		const radians = S.haversine(res, ctx.cmp);
		const km = radians*6371.0088;
		write('- Degrees: ', formatAngle(radians/DEG));
		write('- Distance: ', km.toFixed(3)*1, ' km / ', (km/1.609344).toFixed(3)*1, ' mi');
	}
	for (let i=0; i<ctx.lops.length; ++i) {
		const lop = ctx.lops[i];
		const { type, center } = lop;
		let dif;
		if (type === COP) {
			dif = (lop.radius - S.haversine(res, center))/DEG;
		}
		if (type === AZM_LOP) {
			dif = angleDif(lop.azm, S.calcAzimuth(res, center))/DEG;
		}
		write('lop ', i + 1, ' dif: ', formatAngle(dif));
	}
};

const runScript = () => {
	const ctx = {
		gp: null,
		cmp: null,
		azmLOP: [],
		radLOP: [],
		lops: [],
	};
	const text = input.value;
	const lines = text.split('\n');
	output.value = '';
	for (let i=0; i<lines.length; ++i) {
		const line = lines[i];
		if (line.trim() === '') {
			continue;
		}
		const cmd = commands.find(cmd => cmd.regex.test(line));
		if (cmd == null) {
			write(`Line ${i + 1} is invalid`);
			return;
		}
		try {
			cmd.run(ctx, line, i);
		} catch (err) {
			if (!(err instanceof ScriptError)) {
				throw err;
			}
			write(`Error in line ${err.lineIndex + 1}: ${err.message}`);
			return;
		}
	}
	finish(ctx);
};

commands.push({
	regex: /^\s*gp\s*:/i,
	run: function(ctx, line, lineIndex) {
		const value = line.replace(this.regex, '').trim();
		const gp = parseLatLon(value);
		if (gp === null) {
			throw new ScriptError('invalid geographical position', lineIndex);
		}
		ctx.gp = gp.map(val => val*DEG);
	},
});

commands.push({
	regex: /^\s*(rad(ius)?|zen(ith)?|zn|co-?alt(itude)?)\s*:/i,
	run: function(ctx, line, lineIndex) {
		const value = line.replace(this.regex, '').trim();
		const rad = parseDegree(value);
		if (isNaN(rad)) {
			throw new ScriptError('invalid angle', lineIndex);
		}
		if (ctx.gp === null) {
			throw new ScriptError('no geographical position given', lineIndex);
		}
		const lop = {
			type: COP,
			center: ctx.gp,
			radius: rad*DEG,
		};
		ctx.radLOP.push(lop);
		ctx.lops.push(lop);
	},
});

commands.push({
	regex: /^\s*(azm|azimuth)\s*:/i,
	run: function(ctx, line, lineIndex) {
		const value = line.replace(this.regex, '').trim();
		const azm = parseDegree(value);
		if (isNaN(azm)) {
			throw new ScriptError('invalid angle', lineIndex);
		}
		if (ctx.gp === null) {
			throw new ScriptError('no geographical position given', lineIndex);
		}
		const lop = {
			type: AZM_LOP,
			center: ctx.gp,
			azm: azm*DEG,
		};
		ctx.azmLOP.push(lop);
		ctx.lops.push(lop);
	},
});

commands.push({
	regex: /^\s*(cmp|compare)\s*:/i,
	run: function(ctx, line, lineIndex) {
		const value = line.replace(this.regex, '').trim();
		const gp = parseLatLon(value);
		if (gp === null) {
			throw new ScriptError('invalid geographical position', lineIndex);
		}
		ctx.cmp = gp.map(val => val*DEG);
	},
});

input.focus();
input.addEventListener('input', runScript);
input.value = `

GP: 45°23'15.5"N, 12°30'42.0"W
Rad: 71° 43' 11"

GP: -30.95424, 63.25619
Azm: 183 23 10
Rad: 45.640278

Compare: 14.6096, 66.0517

`.trim();
runScript();
