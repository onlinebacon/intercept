import { toDeg } from '../calc/degrees-radians.js';
import { ExecutionContext } from './execution-context.js';
import { AzLoP } from './lop.js';
import { writeln } from '../stdout.js';
import { haversine } from '../lib/js/sphere-math.js';
import { EARTH_AV_RAD } from '../constants.js';
import { round } from '../utils.js';

const showErrors = (ctx, coord) => {
    const { lops, labels } = ctx;
    const formatter = ctx.angleFormatter.forcingSign(true);
    for (let i=0; i<lops.length; ++i) {
        const lop = lops[i];
        const label = labels[i] ?? (lop instanceof AzLoP ? '*Az' : '*CoP');
        const err = toDeg(lop.error(coord));
        writeln(' ', i + 1, '. ', formatter.format(err), ' // ' + label);
    }
};

export const logLoPErrors = (ctx = new ExecutionContext()) => {
    writeln('LoPs errors:');
    showErrors(ctx, ctx.compare);
};

export const logLoPResiduals = (ctx = new ExecutionContext()) => {
    writeln('LoPs residuals:');
    showErrors(ctx, ctx.results[0]);
};

export const logError = (ctx = new ExecutionContext()) => {
    const rad = haversine(ctx.results[0], ctx.compare);
    const km = rad * EARTH_AV_RAD / 1000;
    const NM = km / 1.852;
    writeln(`Error: ${ctx.rad(rad)} / ${round(NM, 3)} NM / ${round(km, 3)} km`);
};
