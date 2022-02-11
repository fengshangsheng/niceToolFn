const path = require('path');
const {merge} = require('webpack-merge');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const baseConfig = require('./webpack.common.js');

console.log('require', Object.keys(require));
console.log(' require.context', require.context);
const prodConfig = {
  mode: 'production', // 开发模式
  entry: path.join(__dirname, "./../src/components/index.tsx"),
  output: {
    path: path.join(__dirname, "./../lib/"),
    filename: "[name].js",
    libraryTarget: 'commonjs2', // 采用通用模块定义
    libraryExport: 'default', // 兼容 ES6 的模块系统、CommonJS 和 AMD 模块规范
  },
  module: {},
  plugins: [
    new CleanWebpackPlugin(),
  ],
  externals: { // 定义外部依赖，避免把react和react-dom打包进去
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react"
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom"
    }
  },
};


module.exports = merge(prodConfig, baseConfig); // 将baseConfig和prodConfig合并为一个配置
