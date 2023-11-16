const randomNum = (min: number, max = 10) => {
    return Math.round(Math.random() * (max - min)) + min;
};

export const MathUtils = {
    randomNum,
};
