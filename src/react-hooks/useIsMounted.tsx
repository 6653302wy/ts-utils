import { useLayoutEffect, useRef, MutableRefObject } from 'react';

/**
 * is component mounted or not
 */
export function useIsMounted(): MutableRefObject<boolean> {
    const isMountedRef = useRef(false);

    useLayoutEffect(() => {
        isMountedRef.current = true;

        return (): void => {
            isMountedRef.current = false;
        };
    });

    return isMountedRef;
}
