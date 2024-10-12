/** 获取指定范围内的随机数 */
const randomNum = (min: number, max = 10) => {
    return Math.round(Math.random() * (max - min)) + min;
};

/** 是否是偶数（index从0开始） */
const isEven = (index: number) => {
    return (index + 1) % 2 === 0;
};

/** 生成唯一随机数 */
const genNonDuplicateID = (randomLen = 12) => {
    return Number(Math.random().toString().substring(2, randomLen) + Date.now()).toString(36);
};

export const MathUtils = {
    randomNum,
    isEven,
    genNonDuplicateID,
};
