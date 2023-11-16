import { getURLParam } from './Url';

/** 是否刘海屏 */
const judgeBigScreen = (): boolean => {
    let result = false;
    const rate = window.screen.height / window.screen.width;
    const limit = window.screen.height === window.screen.availHeight ? 1.8 : 1.65;
    if (rate > limit) {
        result = true;
    }
    return result;
};

const rem2px = (n: number, base = 750): number => {
    return n * 100 * (document.documentElement.offsetWidth / base);
};

/** 获取滚动条位置 */
const getScrollTop = (): number => {
    return document.documentElement.scrollTop || document.body.scrollTop;
};

// 滚动到指定位置
const setScrollTop = (top: number, smooth = false): void => {
    if (smooth && 'scrollBehavior' in document.documentElement.style) {
        try {
            window.scrollTo({
                top,
                behavior: 'smooth',
            });
        } catch (e) {
            document.documentElement.scrollTop = top;
            document.body.scrollTop = top;
        }
    } else {
        document.documentElement.scrollTop = top;
        document.body.scrollTop = top;
    }
};

const paramsData = {} as Record<string, string>;
const getUrlParam = (key: string): string => {
    if (key in paramsData) {
        return paramsData[key];
    }
    return getURLParam(window.location.href, key);
};

export const Browser = {
    judgeBigScreen,
    rem2px,
    getScrollTop,
    setScrollTop,
    getUrlParam,
};
