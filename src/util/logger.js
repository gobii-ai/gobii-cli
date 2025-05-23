"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableVerbose = enableVerbose;
exports.logVerbose = logVerbose;
exports.logInfo = logInfo;
exports.logError = logError;
let verboseEnabled = false;
function enableVerbose() {
    verboseEnabled = true;
}
function logVerbose(...args) {
    if (verboseEnabled) {
        console.log('[verbose]', ...args);
    }
}
function logInfo(...args) {
    console.log(...args);
}
function logError(...args) {
    console.error('[error]', ...args);
}
