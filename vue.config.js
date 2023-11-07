const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? process.env.PUBLIC_PATH : '/',
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ],
    devtool: 'source-map'
  },
  devServer: {
    proxy: 'http://localhost:8081/',
  }
})