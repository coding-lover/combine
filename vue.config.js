const path = require('path');
//console.log(path.resolve(__dirname, './dist/index.html'));
module.exports = {
    //baseUrl: '/',
    //assetsDir: 'static',
    //productionSourceMap: false,

    // devServer: {
    //     port: 8081,
    //     proxy: {
    //         '/api/':{
    //             target:'https://kit.imbin.cn/',
    //             changeOrigin:true,
    //             /*pathRewrite:{
    //                 '^/api':''
    //             }*/
    //         }
    //     }
    // }
    devServer: {
        port: 8083,
        //open:true
    },
    publicPath: './',
    //publicPath: './',
    /*build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, './dist/index.html'),
        assetsRoot: path.resolve(__dirname, './dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }*/

    filenameHashing: false,
}
