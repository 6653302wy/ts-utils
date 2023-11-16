/**
 * 首字母大写
 */
const upperFirst = (str: string): string => {
    return str.replace(/(\w)/, ($1) => $1.toLocaleUpperCase());
};

/**
 * 获取字符串的字节长度
 */
const byteSize = (str: string): number => {
    return new Blob([str]).size;
};

/**
 * 移除字符串中的html标签
 */
const removeHTML = (str: string): string => {
    return str.replace(/<[^>]+>/g, '').replace(/&[\s\S]+?;/g, '');
};

/**
 * 字符串替换
 * 使用指定的掩码字符替换start~length之间的所有字符
 * @example
 * mask('123456') // => '******'
 * @example
 * 设置开始位置
 * mask('123456', 2) // => '12****'
 * @example
 * 设置长度
 * mask('123456', 2, 3) // => '12***6'
 * @example
 * 修改掩码字符
 * mask('123456', 2, 3, '.') // => '12...6'
 */
const mask = (str: string, start = 0, length?: number, mask = '*'): string => {
    const val = length || length === 0 ? str.slice(start, length + start) : str.slice(start);
    return str.replace(val, mask.padEnd(val.length, mask));
};

/**
 *  指定位置插入字符串
 * @param origin
 * @param index
 * @param insert
 * @returns
 */
const insertStr = (origin: string, index: number, insert: string) => {
    if (index <= -1) return origin;
    return origin.substring(0, index) + insert + origin.substring(index);
};

export const StringUtils = {
    upperFirst,
    byteSize,
    removeHTML,
    mask,
    insertStr,
};
