"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugFetch = debugFetch;
exports.fetchJson = fetchJson;
exports.postJson = postJson;
exports.fetchSuccess = fetchSuccess;
const logger_1 = require("../util/logger");
function debugFetch(url_1) {
    return __awaiter(this, arguments, void 0, function* (url, options = {}) {
        (0, logger_1.logVerbose)('--- FETCH DEBUG ---');
        (0, logger_1.logVerbose)('URL:', url);
        (0, logger_1.logVerbose)('Method:', options.method || 'GET');
        (0, logger_1.logVerbose)('Headers:', options.headers);
        if (options.body) {
            (0, logger_1.logVerbose)('Body:', typeof options.body === 'string' ? options.body : '[non-string body]');
        }
        const response = yield fetch(url, options);
        (0, logger_1.logVerbose)('Status:', response.status, response.statusText);
        (0, logger_1.logVerbose)('Response Headers:');
        response.headers.forEach((value, key) => {
            (0, logger_1.logVerbose)(`  ${key}: ${value}`);
        });
        const contentType = response.headers.get('content-type') || '';
        let body;
        if (contentType.includes('application/json')) {
            body = yield response.clone().json();
            (0, logger_1.logVerbose)('Response JSON:', body);
        }
        else {
            body = yield response.clone().text();
            (0, logger_1.logVerbose)('Response Text:', body);
        }
        (0, logger_1.logVerbose)('--- END FETCH DEBUG ---');
        return response;
    });
}
/**
 * Base fetch function
 *
 * @param endpoint - The endpoint to fetch
 * @param apiKey - The API key to use
 * @param options - The options to pass to the fetch request
 *
 * @returns The response
 */
function baseFetch(endpoint_1, apiKey_1) {
    return __awaiter(this, arguments, void 0, function* (endpoint, apiKey, options = {}) {
        const url = `https://getgobii.com/api/v1/${endpoint}`;
        (0, logger_1.logVerbose)('Fetching: ', url);
        const response = yield fetch(url, Object.assign(Object.assign({}, options), { headers: Object.assign({ 'X-Api-Key': apiKey, 'Content-Type': 'application/json' }, (options.headers || {})) }));
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${yield response.text()}`);
        }
        return response;
    });
}
/**
 * Base POST fetch function
 *
 * @param endpoint - The endpoint to fetch
 * @param apiKey - The API key to use
 * @param options - The options to pass to the fetch request; body is required and a string. This expects any prep to already be done, ex: JSON.stringify({})
 *
 * @returns The response object
 */
function basePost(endpoint_1, apiKey_1) {
    return __awaiter(this, arguments, void 0, function* (endpoint, apiKey, options = {}) {
        const url = `https://getgobii.com/api/v1/${endpoint}`;
        const response = yield debugFetch(url, Object.assign(Object.assign({}, options), { method: 'POST', headers: Object.assign({ 'X-Api-Key': apiKey, 'Content-Type': 'application/json' }, (options.headers || {})), body: options.body }));
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${yield response.text()}`);
        }
        console.log('Response: ', JSON.stringify(response, null, 2));
        return response;
    });
}
/**
 * Fetch a resource and return the JSON response
 *
 * @param endpoint - The endpoint to fetch
 * @param apiKey - The API key to use
 * @param options - The options to pass to the fetch request
 *
 * @returns The JSON response
 */
function fetchJson(endpoint_1, apiKey_1) {
    return __awaiter(this, arguments, void 0, function* (endpoint, apiKey, options = {}) {
        const response = yield baseFetch(endpoint, apiKey, options);
        return response.json();
    });
}
/**
 * Post a resource and return the JSON response
 *
 * @param endpoint - The endpoint to fetch
 * @param apiKey - The API key to use
 * @param options - The options to pass to the fetch request
 *
 * @returns The JSON response
 */
function postJson(endpoint_1, apiKey_1) {
    return __awaiter(this, arguments, void 0, function* (endpoint, apiKey, options = {}) {
        const response = yield basePost(endpoint, apiKey, options);
        return response.json();
    });
}
/**
 * Fetch a resource and return true if the request was successful, false otherwise
 *
 * @param endpoint - The endpoint to fetch
 * @param apiKey - The API key to use
 * @param options - The options to pass to the fetch request
 *
 * @returns True if the request was successful, false otherwise
 */
function fetchSuccess(endpoint_1, apiKey_1) {
    return __awaiter(this, arguments, void 0, function* (endpoint, apiKey, options = {}) {
        try {
            const response = yield baseFetch(endpoint, apiKey, options);
            if (response.ok) {
                return true;
            }
        }
        catch (error) {
            //TODO: Log the error
            (0, logger_1.logError)('Error fetching: ', endpoint);
            (0, logger_1.logError)(error);
        }
        return false;
    });
}
