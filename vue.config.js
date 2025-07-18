const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  configureWebpack: {
    devtool: 'source-map', // 确保生成完整的 Source Map
  },
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
