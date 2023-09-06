const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    // app.use(
    //     createProxyMiddleware('/xms-dev/api', {
    //         target: 'http://localhost:7001',
    //         changeOrigin: true,
    //         pathRewrite: {'/xms-dev/api': '/xms-dev/api'}
    //     })
    // );
    // app.use(
    //     createProxyMiddleware('https://api.github.com', {
    //         target: 'https://api.github.com',
    //         changeOrigin: true,
    //         pathRewrite: {'https://api.github.com': 'https://api.github.com'}
    //     })
    // );
    // app.use(
    //     createProxyMiddleware('https://www.github.com', {
    //         target: 'https://www.github.com',
    //         changeOrigin: true,
    //         pathRewrite: {'https://www.github.com': 'https://www.github.com'}
    //     })
    // );
};