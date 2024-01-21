export const tableToText = (table) => {
	const strTable = table.map(row => {
		return row.map(item => item.toString());
	});
	const colLengths = [];
	strTable.forEach(row => {
		row.forEach((col, i) => {
			const { length } = col;
			if (i >= colLengths.length) {
				colLengths[i] = length;
			} else {
				colLengths[i] = Math.max(colLengths[i], length);
			}
		});
	});
	const lines = strTable.map((row, rowIndex) => {
		return row.map((item, i) => {
			const str = item ?? '';
			if (rowIndex === 0) {
				return str.padEnd(colLengths[i], ' ');
			}
			return str.padEnd(colLengths[i], ' ');
		}).join('  ');
	});
	return lines.join('\n');
};
