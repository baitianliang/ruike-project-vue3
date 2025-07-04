const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: false,
  publicPath: './',
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://jsonplaceholder.typicode.com',
        target: 'https://dls.4dlp.com.cn:7102/dls-strengthen/',
        // target: 'http://192.168.2.173:8092/dls-strengthen/',
        // target: 'http://10.73.60.92:8092',
        changeOrigin: true,
        pathRewrite: {
            '^/api': '',
        },
      },
    },
  }
})
