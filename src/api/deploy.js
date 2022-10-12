import request from '../utils/rpcRequest';
import globalConfig from '../utils/config';

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getSwooleStats(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        params: {uri: '/test/deploy/stats'}
    });
}


/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getGoldSwooleStats(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        baseURL: globalConfig.GOLD_API_HOST,
        params: {uri: '/test/deploy/stats'}
    });
}

/**
 *
 * @param query [taid => 1]
 * @returns {AxiosPromise<any>}
 */
export async function getAiSwooleStats(query) {
    return request({
        url: globalConfig.SWOOLE_DIPATCH_URI,
        method: 'get',
        baseURL: globalConfig.AI_API_HOST,
        params: {uri: '/test/deploy/stats'}
    });
}













