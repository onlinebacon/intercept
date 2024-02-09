import { toDeg } from '../calc/degrees-radians.js';
import { ExecutionContext } from './execution-context.js';
import { AzLoP } from './lop.js';
import { writeln } from '../stdout.js';

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

export const logLoPResiduals = (ctx = new ExecutionContext()) => {
    writeln('Residuals:');
    showErrors(ctx, ctx.results[0]);
};

export const logLoPErrors = (ctx = new ExecutionContext()) => {
    writeln('Errors:');
    showErrors(ctx, ctx.compare);
};
