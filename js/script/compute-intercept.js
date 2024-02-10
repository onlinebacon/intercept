import { ExecutionContext } from './execution-context.js';
import { icosahedronCoords } from '../lib/js/icosahedron-coords.js';
import { SphericalMinimizer } from '../lib/js/spherical-minimizer.js';
import { removeBadResults, removeDoubles } from './reduce-solutions.js';
import { haversine } from '../lib/js/sphere-math.js';

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
	removeDoubles(minimizers);
	removeBadResults(minimizers);
	if (ctx.compare != null) {
		const temp = minimizers.map(minimizer => {
			const error = haversine(ctx.compare, minimizer.coord);
			return { minimizer, error };
		});
		temp.sort((a, b) => a.error - b.error);
		minimizers.length = 0;
		minimizers.push(...temp.map(item => item.minimizer));
	} else {
		minimizers.sort((a, b) => a.value - b.value);
	}
	ctx.results = minimizers.map(m => m.coord);
};
