export const parseZone = (str) => {
	if (/^(GMT|UTC)$/.test(str)) {
		return '+0000';
	}
	str = str.replace(/\s+/, '');
	str = str.replace(/^(GMT|UTC)/i, '');
	str = str.replace(/^(\d)/, '+$1');
	str = str.replace(/\d+:\d+/, s => {
		const [ hr, min ] = s.split(':');
		return hr.padStart(2, '0') + min.padStart(2, '0');
	});
	str = str.replace(/\d+$/, s => s.length <= 2 ? s.padStart(2, '0') + '00' : s);
	if (!/^[\+\-]\d{4}$/.test(str)) {
		return null;
	}
	const hr = str.substring(1, 3);
	const min = str.substring(3, 5);
	if (Number(hr) > 23 || Number(min) >= 60) {
		return null;
	}
	return str;
};
