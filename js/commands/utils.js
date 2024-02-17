const labelRegex = /\((.+)\)$/;
export const moveLabel = (ctx, line) => {
    const match = line.match(labelRegex);
    if (!match) {
        ctx.labels.push(null);
        return line;
    }
    ctx.labels.push(match[1]);
    return line.replace(labelRegex, '').trim();
};
