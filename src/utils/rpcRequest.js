import axios from 'axios';
import globalConfig from './config';
const localStorageRegnumber = localStorage.getItem('_n') || 6666;
const localStorageToken = localStorage.getItem('_t') || '5b04a34125b1eab46343d5d398b45976';

console.log(globalConfig.KIT_API_HOST);

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    baseURL: globalConfig.KIT_API_HOST,
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        //console.log(config);

        config.headers.Regnumber = localStorageRegnumber;
        config.headers.Token = localStorageToken;

        console.log(config);

        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if(response.data.code == 9)
        {
            //登录
            //next('login');
        }

        if (response.status === 200) {
            return response.data;
        }

        return Promise.reject(response.statusText);
    },
    error => {
        console.log(error);
        return Promise.reject('Network error !');
    }
);

export default service;
