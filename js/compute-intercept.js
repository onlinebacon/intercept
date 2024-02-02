import { toDeg } from './degrees-radians.js';
import { ExecutionContext } from './execution-context.js';
import { icosahedronCoords } from './lib/js/icosahedron-coords.js';
import { SphericalMinimizer } from './lib/js/spherical-minimizer.js';

export const computeIntercept = async (ctx = new ExecutionContext()) => {
	const { lops } = ctx;
	const fn = (coord) => {
		let sum = 0;
		for (const lop of lops) {
			sum += lop.error(coord) ** 2;
		}
		return sum;
	};
	const minimizers = icosahedronCoords.map(coord => {
		return new SphericalMinimizer({ fn, coord });
	});
	const maxLock = 100;
	let timeout = Date.now() + maxLock;
	for (let i=0; i<1000; ++i) {
		for (let m of minimizers) {
			m.iterate();
		}
		const now = Date.now();
		if (now >= timeout) {
			await new Promise(f => setTimeout(f, 0));
			timeout = now + maxLock;
		}
	}
	minimizers.sort((a, b) => a.value - b.value);
	return minimizers[0].coord.map(toDeg);
};
