import request from '../utils/rpcRequest';
import globalConfig from '../utils/config';

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getWalletById(query) {
    return request({
        url: '/api/accounts/getWalletById',
        method: 'get',
        params: query
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getSpotBalanceById(query) {
    return request({
        url: '/api/accounts/getSpotBalanceById',
        method: 'get',
        params: query
    });
}

/**
 *
 * @param query [taid => 1, mode => all]
 * @returns {AxiosPromise<any>}
 */
export async function getMarginInfoById(query) {
    return request({
        url: '/api/accounts/getMarginInfoById',
        method: 'get',
        params: query
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getMarginBalanceById(query) {
    return request({
        url: '/api/accounts/getMarginBalanceById',
        method: 'get',
        params: query
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getFutureBalanceById(query) {
    return request({
        url: '/api/accounts/getFutureBalanceById',
        method: 'get',
        params: query
    });
}

/**
 *
 * @param query [taid, symbol, contract]
 * @returns {AxiosPromise<any>}
 */
export async function getFuturePositionById(query) {
    return request({
        url: '/api/accounts/getFuturePositionById',
        method: 'get',
        params: query
    });
}

/**
 *
 * @param query [taid]
 * @returns {AxiosPromise<any>}
 */
export async function getFuturePositionAllById(query) {
    return request({
        url: '/api/accounts/getFuturePositionAllById',
        method: 'get',
        params: query
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getSwapBalanceById(query) {
    return request({
        url: '/api/accounts/getSwapBalanceById',
        method: 'get',
        params: query
    });
}

/**
 *
 * @param query [taid, symbol]
 * @returns {AxiosPromise<any>}
 */
export async function getSwapPositionById(query) {
    return request({
        url: '/api/accounts/getSwapPositionById',
        method: 'get',
        params: query
    });
}

/**
 *
 * @param query [taid]
 * @returns {AxiosPromise<any>}
 */
export async function getSwapPositionAllById(query) {
    return request({
        url: '/api/accounts/getSwapPositionAllById',
        method: 'get',
        params: query
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getSpotCacheById(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        params: Object.assign(query, {uri: '/test/accounts/getSpotCache'})
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getMarginCacheById(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        params: Object.assign(query, {uri: '/test/accounts/getMarginCache'})
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getFutureCacheById(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        params: Object.assign(query, {uri: '/test/accounts/getFutureCache'})
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getFuturePosCacheById(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        params: Object.assign(query, {uri: '/test/accounts/getFuturePosCache'})
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getSwapCacheById(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        params: Object.assign(query, {uri: '/test/accounts/getSwapCache'})
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getSwapPosCacheById(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        params: Object.assign(query, {uri: '/test/accounts/getSwapPosCache'})
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getSpotWithRecoupById(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        params: Object.assign(query, {uri: '/test/accounts/getSpotWithRecoup'})
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getMarginWithRecoupById(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        params: Object.assign(query, {uri: '/test/accounts/getMarginWithRecoup'})
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getFutureWithRecoupById(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        params: Object.assign(query, {uri: '/test/accounts/getFutureWithRecoup'})
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getFuturePosWithRecoupById(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        params: Object.assign(query, {uri: '/test/accounts/getFuturePosWithRecoup'})
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getSwapWithRecoupById(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        params: Object.assign(query, {uri: '/test/accounts/getSwapWithRecoup'})
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getSwapPosWithRecoupById(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        params: Object.assign(query, {uri: '/test/accounts/getSwapPosWithRecoup'})
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getFutureCollectById(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        params: Object.assign(query, {uri: '/test/accounts/getFutureCollect'})
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getFuturePosCollectById(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        params: Object.assign(query, {uri: '/test/accounts/getFuturePosCollect'})
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getSwapCollectById(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        params: Object.assign(query, {uri: '/test/accounts/getSwapCollect'})
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getSwapPosCollectById(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        params: Object.assign(query, {uri: '/test/accounts/getSwapPosCollect'})
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getBalanceSummary(query) {
    return request({
        url: '/api/custom/summaryBalanceNew',
        method: 'get',
        params: query
    });
}

export async function getOrderList(query) {
    return request({
        url: '/api/test/getOrderList',
        method: 'get',
        params: query
    });
}










