import request from '../utils/rpcRequest';

export async function login(query) {
    return request({
        url: '/api/test/login',
        method: 'post',
        params: query,

    });
}
