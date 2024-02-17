const regex = /^\d+:\d+:\d+(\.\d+)?$/;
export const parseTime = (str) => {
	if (!regex.test(str)) {
		return null;
	}
	const [ h, min, sec, sFrac = '0' ] = str.split(/[:\.]/);
	if (Number(h) >= 24 || Number(min) >= 60 || Number(sec) >= 60) {
		return null;
	}
	return `${h.padStart(2, '0')}:${min.padStart(2, '0')}:${sec.padStart(2, '0')}.${sFrac}`;
};
