const months = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december',
];

const validDate = (str) => {
	const iso = str + 'T00:00:00Z';
	const date = new Date(iso);
	return !isNaN(date.getTime());
};

const parseTextFormat = (str) => {
	const items = str.trim().toLowerCase().split(/\s*,\s*|\s+/);
	if (items.length !== 3) {
		return null;
	}
	const [ rawMonth, rawDay, rawYear ] = items;
	const shortMonth = rawMonth.substring(0, 3);
	const month = months.find(item => item === rawMonth || item.substring(0, 3) === shortMonth);
	if (!month) {
		return null;
	}
	if (!/^\d{1,2}(st|nd|rd|th)?$/.test(rawDay)) {
		return null;
	}
	const day = Number(rawDay.replace(/[a-z]+$/, ''));
	if (isNaN(day)) {
		return null;
	}
	const year = Number(rawYear);
	const monthNumber = months.indexOf(month) + 1;
	const res = year + `-${(monthNumber + '').padStart(2, '0')}-${(day + '').padStart(2, '0')}`;
	return validDate(res) ? res : null;
};

const parseDateISOFormat = (str) => {
	if (/^\d+-\d+-\d+$/.test(str)) {
		const [ year, month, day ] = str.split('-');
		const padded = [
			year.padStart(4, '0'),
			month.padStart(2, '0'),
			day.padStart(2, '0'),
		].join('-');
		return validDate(padded) ? padded : null;
	}
	return null;
};

export const parseDate = (str) => {
	return parseDateISOFormat(str) ?? parseTextFormat(str);
};
