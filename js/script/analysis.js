import { toDeg } from '../calc/degrees-radians.js';
import { ExecutionContext } from './execution-context.js';
import { AzLoP } from './lop.js';
import { writeln } from '../stdout.js';
import { haversine } from '../lib/js/sphere-math.js';
import { EARTH_AV_RAD_METERS } from '../constants.js';
import { round } from '../utils.js';

const sum = (a, b) => a + b;

const showErrors = (ctx, coord) => {
    const { lops, labels } = ctx;
    const formatter = ctx.angleFormatter.forcingSign(true);
    const all = [];
    for (let i=0; i<lops.length; ++i) {
        const lop = lops[i];
        const label = labels[i] ?? (lop instanceof AzLoP ? '*Az' : '*CoP');
        const err = toDeg(lop.error(coord));
        all[i] = err;
        writeln(i + 1, '. ', formatter.format(err), ' // ' + label);
    }
    const n = all.length;
    const mean = all.reduce(sum, 0) / n;
    const sd = (all.map((val) => (val - mean) ** 2).reduce(sum, 0) / n) ** 0.5;
    writeln('Mean/SD: ', formatter.format(mean), ', ', formatter.format(sd));
};

export const logLoPErrors = (ctx = new ExecutionContext()) => {
    writeln('LoPs errors:');
    showErrors(ctx, ctx.compare);
};

export const logLoPResiduals = (ctx = new ExecutionContext()) => {
    writeln('LoPs residuals:');
    showErrors(ctx, ctx.results[0]);
};

export const computeError = (ctx = new ExecutionContext(), coord) => {
    const rad = haversine(ctx.compare, coord);
    const unit = ctx.lenUnit;
    const dist = rad * EARTH_AV_RAD_METERS / unit.inMeters;
    return round(dist, 3) + unit.symbols[0];
};
