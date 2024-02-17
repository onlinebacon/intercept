const SD = 86164.09053820801;
const NULL = 1656652979.900;

export const calcAriesGHA = (unixTime) => {
	const angle = (unixTime - NULL) * 360 / SD;
	return (angle % 360 + 360) % 360;
};
