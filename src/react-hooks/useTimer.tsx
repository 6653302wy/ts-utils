import { useCallback, useEffect, useRef } from 'react';

type TimerReturnType = ReturnType<typeof setTimeout>;
type IntervalReturnType = ReturnType<typeof setInterval>;
type TimerIdType = string | number | undefined;

type TimerType = {
    timerOnce: (fun: () => void, delay: number) => TimerReturnType;
    timerLoop: (fun: () => void, delay: number, runCount?: number) => IntervalReturnType;
    // clearTimer: (timer: TimerIdType) => void;
    // clearTimerAll: () => void;
};

export const useTimer = (): TimerType => {
    const timerList = useRef<TimerIdType[]>([]);

    const delTimer = useCallback(
        (timerID: TimerIdType, once?: boolean) => {
            if (timerID) {
                if (once) clearTimeout(Number(timerID));
                else clearInterval(Number(timerID));

                const timerIndex = timerList.current.indexOf(Number(timerID));
                if (timerIndex >= 0) {
                    timerList.current.splice(timerIndex, 1);
                }
                // console.log('清除单个timer=====', timerID);
            }
        },
        [timerList],
    );

    // const clearTimer = useCallback(
    //     (timerID: TimerIdType) => {
    //         delTimer(timerID);
    //     },
    //     [delTimer],
    // );

    const clearTimerAll = useCallback(() => {
        while (timerList.current.length) {
            const timer = timerList.current.shift();
            if (timer) {
                clearTimeout(timer);
                clearInterval(timer);
            }
            // console.log('清除所有timer=====', timer);
        }
        timerList.current.length = 0;
    }, [timerList]);

    /** 执行一次timer */
    const timerOnce = (method: () => void, delay: number): TimerReturnType => {
        const timer = setTimeout(() => {
            method();
            delTimer(timer, true);
        }, delay);

        timerList.current.push(timer);
        return timer;
    };

    /** 执行多次timer
     * @mpara runCount 执行次数 不填则为循环执行
     */
    const timerLoop = (
        method: () => void,
        delay: number,
        runCount?: number,
    ): IntervalReturnType => {
        const timer = setInterval(() => {
            method();
            let num = runCount;
            if (num) {
                num -= 1;
                if (num <= 0) {
                    delTimer(timer, false);
                }
            }
        }, delay);
        timerList.current.push(timer);
        return timer;
    };

    useEffect(() => {
        return clearTimerAll;
    }, [clearTimerAll]);

    return { timerOnce, timerLoop };
};
