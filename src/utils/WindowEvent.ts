export const emitEvent = (evtName: string, params?: any) => {
    if (params) {
        window.dispatchEvent(new CustomEvent(evtName, { detail: params }));
    } else {
        window.dispatchEvent(new Event(evtName));
    }
};

export const catchEvent = (evtName: string, handler: (e: any) => void) => {
    window.addEventListener(evtName, handler);
};

export const removeEvent = (evtName: string, handler: (e: any) => void) => {
    window.removeEventListener(evtName, handler);
};
