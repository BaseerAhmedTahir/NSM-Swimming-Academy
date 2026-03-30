// General helper functions can go here

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const safeJSONParse = (objStr: string | null | undefined, defaultVal: any = null) => {
    if (!objStr) return defaultVal;
    try {
        return JSON.parse(objStr);
    } catch (e) {
        return defaultVal;
    }
};
