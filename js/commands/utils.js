import { ExecutionContext } from '../script/execution-context.js';

const labelRegex = /\((.+)\)$/;

export const moveLabel = (ctx = new ExecutionContext(), line) => {
    const match = line.match(labelRegex);
    if (!match) {
        ctx.labels.push(ctx.defLabel);
        return line;
    }
    ctx.labels.push(match[1]);
    return line.replace(labelRegex, '').trim();
};
