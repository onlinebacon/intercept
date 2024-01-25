import { calcAltStdRefraction } from './calc-alt-refraction.js';
import { calcDip } from './calc-dip.js';
import { icosahedronCoords } from './lib/js/icosahedron-coords.js';
import { parseDegree } from './lib/js/parse-degree.js';
import { parseLatLon } from './lib/js/parse-lat-lon.js';
import * as S from './lib/js/sphere-math.js';
import { SphericalMinimizer } from './lib/js/spherical-minimizer.js';
import { D180, D360, DEG } from './lib/js/trig.js';
import { parseHeight } from './parse-height.js';
import { parseRefractionMultiplier } from './parse-refraction.js';
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
	const lat = formatAngle(coord[0]/DEG, [ 'S ', 'N ' ]);
	const lon = formatAngle(coord[1]/DEG, [ 'W ', 'E ' ]);
	return `${lat}, ${lon}`;
};

const diffsToStandardDeviation = (diffs) => {
	let sqrSum = 0;
	for (let diff of diffs) {
		sqrSum += diff**2;
	}
	return Math.sqrt(sqrSum/diffs.length);
};

const listLOPDifferences = (lops, coord, showOutliers = false) => {
	const headers  = [ '', 'Type', 'Value' ];
	const array = lops.map((lop) => {
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
		return { diff, typeText };
	});
	const diffs = array.map(item => item.diff);
	const stdDev = diffsToStandardDeviation(diffs);
	const rows = array.map((item, i) => {
		const { diff, typeText } = item;
		const row = [ i + 1 + '.', typeText, formatAngle(diff, '-+') ];
		if (showOutliers && Math.abs(diff) > 2*stdDev) {
			row.push('(outlier)');
		}
		return row;
	});
	const table = [ headers, ...rows ];
	write(tableToText(table));
};

const solve = async (ctx) => {
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
	const startTime = Date.now();
	for (let i=0; i<1000; ++i) {
		minimizers.forEach(min => min.iterate());
		const dt = Date.now() - startTime;
		if (dt > 100) {
			await new Promise(f => setTimeout(f, 0));
		}
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
		write('Distance/Azimuth errors:');
		listLOPDifferences(ctx.lops, ctx.cmp);
	}
	write('');
	write('Distance/Azimuth residuals:');
	listLOPDifferences(ctx.lops, res, true);
};

const runScript = async () => {
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
	for (let i=0; i<lines.length; ++i) {
		const line = lines[i].replace(/#.*$/, '');
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
	await solve(ctx);
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
	regex: /^\s*ref(raction)?\s*:/i,
	run: function(ctx, line, lineIndex) {
		const str = line.replace(/^\s*\w+\s*:/, '').trim();
		if (/^none$/i.test(str)) {
			ctx.refMul = null;
			return;
		}
		if (/^(std|standard)$/i.test(str)) {
			ctx.refMul = 1;
			return;
		}
		const refMul = parseRefractionMultiplier(str);
		if (refMul === null) {
			throw new ScriptError('invalid value for refraction', lineIndex);
		}
		ctx.refMul = refMul;
	},
});

commands.push({
	regex: /^\s*rad(ius)?\s*:/i,
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
	regex: /^\s*height\s*:/i,
	run: function(ctx, line, lineIndex) {
		const value = line.replace(this.regex, '').trim();
		const h = parseHeight(value);
		if (isNaN(h)) {
			throw new ScriptError('invalid height', lineIndex);
		}
		ctx.height = h;
	},
});

commands.push({
	regex: /^\s*(zen(ith)?|zn|co-?alt)\s*:/i,
	run: function(ctx, line, lineIndex) {
		const value = line.replace(this.regex, '').trim();
		let zen = parseDegree(value);
		if (isNaN(zen)) {
			throw new ScriptError('invalid angle', lineIndex);
		}
		if (ctx.gp === null) {
			throw new ScriptError('no geographical position given', lineIndex);
		}
		if (ctx.refMul != null) {
			const apAlt = 90 - zen;
			const ref = calcAltStdRefraction(apAlt)*ctx.refMul;
			const alt = apAlt - ref;
			zen = 90 - alt;
		}
		const rad = zen;
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
	regex: /^\s*(alt(itude)?|elevation)\s*:/i,
	run: function(ctx, line, lineIndex) {
		const value = line.replace(this.regex, '').trim();
		let alt = parseDegree(value);
		if (isNaN(alt)) {
			throw new ScriptError('invalid angle', lineIndex);
		}
		if (ctx.gp === null) {
			throw new ScriptError('no geographical position given', lineIndex);
		}
		if (ctx.refMul != null) {
			const ref = calcAltStdRefraction(alt)*ctx.refMul;
			alt -= ref;
		}
		const rad = 90 - alt;
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
	regex: /^\s*hs\s*:/i,
	run: function(ctx, line, lineIndex) {
		const value = line.replace(this.regex, '').trim();
		const hs = parseDegree(value);
		if (isNaN(hs)) {
			throw new ScriptError('invalid angle', lineIndex);
		}
		if (ctx.gp === null) {
			throw new ScriptError('no geographical position given', lineIndex);
		}
		let alt = hs;
		if (ctx.height != null) {
			const dip = calcDip(ctx.height);
			alt -= dip;
		}
		if (ctx.refMul != null) {
			const ref = calcAltStdRefraction(alt)*ctx.refMul;
			alt -= ref;
		}
		const rad = 90 - alt;
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
input.value = `

Refraction: Standard

GP: 45°23'15.5"N, 12°30'42.0"W
Rad: 71° 40' 29"

GP: -30.95424, 63.25619
Azm: 183 21 27
Alt: 44.360278

GP: 51 55' 15", -10
Zen: 69 55 20

# This azimuth is an outlier
# Azm: 321 25 12

Compare: 14.6096, 66.0517
Format: Sec

`.trim();

const msgDom = document.querySelector('.panel .message');
document.querySelector('#calculate').addEventListener('click', async function() {
	if (this.hasAttribute('disabled')) {
		return;
	}
	msgDom.innerText = 'Calculating...';
	this.setAttribute('disabled', '');
	output.value = '';
	const start = Date.now();
	try {
		await runScript();
	} catch(err) {
		write('Error during execution!');
	}
	const end = Date.now();
	write('\nRuntime: ', end - start, 'ms');
	msgDom.innerText = '';
	this.removeAttribute('disabled');
});
