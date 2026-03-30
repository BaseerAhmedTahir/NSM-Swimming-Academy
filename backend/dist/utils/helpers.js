"use strict";
// General helper functions can go here
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeJSONParse = exports.delay = void 0;
const delay = (ms) => new Promise(res => setTimeout(res, ms));
exports.delay = delay;
const safeJSONParse = (objStr, defaultVal = null) => {
    if (!objStr)
        return defaultVal;
    try {
        return JSON.parse(objStr);
    }
    catch (e) {
        return defaultVal;
    }
};
exports.safeJSONParse = safeJSONParse;
