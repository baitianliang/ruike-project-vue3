const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: false,
  publicPath: './',
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://dls.4dlp.com.cn:7102/dls-strengthen/',
        changeOrigin: true,
        pathRewrite: {
            '^/api': '',
        },
      },
    },
  }
})
