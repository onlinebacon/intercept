const a = 0.004178074652294633;
const b = 100.17744491179369;

export const calcAriesGHA = (unixTime) => {
    return (unixTime*a + b) % 360;
};
