let KIT_API_HOST = "https://kit.imbin.cn";
let GOLD_API_HOST = "https://kit.imbin.cn";
let AI_API_HOST = "https://kit.imbin.cn";

let SWOOLE_DIPATCH_URI = '/api/accounts/rpcDispatch';

if(process.env.NODE_ENV != 'development')
{
    KIT_API_HOST = document.location.protocol + "//" + document.location.hostname;
    GOLD_API_HOST = KIT_API_HOST.replace('.one', '.pro');
    AI_API_HOST = KIT_API_HOST.replace('.one', '.ai');
}

export default {
    KIT_API_HOST,
    GOLD_API_HOST,
    AI_API_HOST,
    SWOOLE_DIPATCH_URI,
}
