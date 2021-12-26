const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://locahost:3001',
    //   target: 'https://news-publish-management.herokuapp.com',
      changeOrigin: true,
    })
  );
};