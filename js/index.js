import { icosahedronCoords } from './lib/js/icosahedron-coords.js';
import { parseDegree } from './lib/js/parse-degree.js';
import { parseLatLon } from './lib/js/parse-lat-lon.js';
import * as S from './lib/js/sphere-math.js';
import { SphericalMinimizer } from './lib/js/spherical-minimizer.js';
import { D180, D360, DEG } from './lib/js/trig.js';
import { tableToText } from './table-to-text.js';

const input = document.querySelector('.text textarea');
const output = document.querySelector('.logs textarea');
const commands = [];

const write = (...values) => {
	output.value += values.join('') + '\n';
};

const AZM_LOP = 0x1;
const COP = 0x2;

const DEG_TYP = 'deg';
const MIN_TYP = 'min';
const SEC_TYP = 'sec';
let angleFormatType = DEG_TYP;

const angleFormatTypes = [ DEG_TYP, MIN_TYP, SEC_TYP ];

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

const formatAngleToDeg = (angle, [ negSign = '-', posSign = '' ] = []) => {
	const deg = Number(Math.abs(angle).toFixed(6));
	const sign = angle < 0 ? negSign : posSign;
	return `${sign}${deg}°`;
};

const formatAngleToMin = (angle, [ negSign = '-', posSign = '' ] = []) => {
	const totalMin = Number((Math.abs(angle)*60).toFixed(1));
	const min = Number((totalMin % 60).toFixed(1));
	const deg = Math.round((totalMin - min)/60);
	const sign = angle < 0 ? negSign : posSign;
	return `${sign}${deg}°${min}'`;
};

const formatAngleToSec = (angle, [ negSign = '-', posSign = '' ] = []) => {
	const totalSec = Number((Math.abs(angle)*60*60).toFixed(1));
	const sec = Number((totalSec % 60).toFixed(1));
	const totalMin = Math.round((totalSec - sec)/60);
	const min = Math.round(totalMin % 60);
	const deg = Math.round((totalMin - min)/60);
	const sign = angle < 0 ? negSign : posSign;
	return `${sign}${deg}°${min}'${sec}"`;
};

const formatAngle = (angle, signs) => {
	switch (angleFormatType) {
		case DEG_TYP: return formatAngleToDeg(angle, signs);
		case MIN_TYP: return formatAngleToMin(angle, signs);
		case SEC_TYP: return formatAngleToSec(angle, signs);
	}
	return new Error('Unknown angle format type');
};

const formatCoord = (coord) => {
	if (angleFormatType === DEG_TYP) {
		return coord.map(val => formatAngle(val/DEG)).join(', ');
	}
	const lat = formatAngle(coord[0], [ 'S ', 'N ' ]);
	const lon = formatAngle(coord[1], [ 'W ', 'E ' ]);
	return `${lat}, ${lon}`;
};

const listLopDifferences = (lops, coord) => {
	const headers  = [ '', 'Type', 'Value' ];
	const rows = lops.map((lop, i) => {
		const { type, center } = lop;
		let diff;
		let typeText;
		if (type === COP) {
			diff = (lop.radius - S.haversine(coord, center))/DEG;
			typeText = 'distance'
		}
		if (type === AZM_LOP) {
			typeText = 'azimuth'
			diff = angleDif(lop.azm, S.calcAzimuth(coord, center))/DEG;
		}
		return [ i + 1 + '.', typeText, formatAngle(diff, '-+') ];
	});
	const table = [ headers, ...rows ];
	write(tableToText(table));
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
		const radians = S.haversine(res, ctx.cmp);
		const km = radians*6371.0088;
		write(`Error: ${formatAngle(radians/DEG)} / ${km.toFixed(3)*1} km / ${(km/1.609344).toFixed(3)*1} mi`);
	}
	if (ctx.cmp != null) {
		write('');
		write('Reading errors:');
		listLopDifferences(ctx.lops, ctx.cmp);
	}
	write('');
	write('Reading residuals:');
	listLopDifferences(ctx.lops, res);
};

const runScript = () => {
	angleFormatType = DEG_TYP;
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
		if (/^\s*#|^\s*$/.test(line)) {
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
	regex: /^\s*format\s*:/i,
	run: function(ctx, line, lineIndex) {
		const type = line.replace(this.regex, '').trim().toLowerCase();
		if (!angleFormatTypes.includes(type)) {
			const types = angleFormatTypes.join(', ');
			throw new ScriptError('unknown angle format. Known formats are: ' + types, lineIndex);
		}
		angleFormatType = type;
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
Format: sec

`.trim();
runScript();
