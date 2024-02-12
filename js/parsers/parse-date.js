export const parseDate = (str) => {
	if (/^\d+-\d+-\d+$/.test(str)) {
		const [ year, month, day ] = str.split('-');
		const padded = [
			year.padStart(4, '0'),
			month.padStart(2, '0'),
			day.padStart(2, '0'),
		].join('-');
		const iso = padded + 'T00:00:00Z';
		const date = new Date(iso);
		if (isNaN(date.getTime())) {
			return null;
		}
		return padded;
	}
	return null;
};
