const R = 6371008.8;

export const calcDip = (h) => {
    const r = 7/6*R;
    const radians = Math.acos(r/(r+h));
    return radians/Math.PI*180;
};
