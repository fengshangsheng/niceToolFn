const fs = require('fs');
const path = require('path');
const {merge} = require('webpack-merge');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const baseConfig = require('./webpack.common.js');

function getComponents(jsonPath, ext, deep = true) {
  let filesUrl = {};

  function findJsonFile(urlPath) {
    let files = fs.readdirSync(urlPath);
    files.forEach(function(item, index) {
      let fPath = path.resolve(urlPath, item);
      let stat = fs.statSync(fPath);
      if (deep && stat.isDirectory() === true) {
        findJsonFile(fPath);
      }

      if (stat.isFile() === true && fPath.match(new RegExp(ext + '$'))) {
        // const fileName = (fPath.indexOf('components') >= 0 ? path.dirname(fPath) : fPath)
        //   .split(path.sep).pop()
        //   .replace(ext, '');

        const urlItem = fPath.split(path.sep);
        const fileName = path.join(...urlItem.slice(urlItem.indexOf('src') + 1)).replace(ext, '')


        filesUrl[fileName] = fPath;
      }
    });
  }
  findJsonFile(jsonPath);

  console.log(filesUrl);
  return filesUrl;
}

const prodConfig = {
  mode: 'production', // 开发模式
  entry: Object.assign(
    {},
    getComponents(path.resolve(__dirname, "./../src"), '.ts', false),
    getComponents(path.resolve(__dirname, "./../src"), '.tsx'),
  ),
  output: {
    path: path.resolve(__dirname, "./../lib/"),
    filename: "[name].js",
    libraryTarget: 'commonjs2', // 采用通用模块定义
    libraryExport: 'default', // 兼容 ES6 的模块系统、CommonJS 和 AMD 模块规范
    environment: {
      arrowFunction: false
    }
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
    },
    "styled-components": {
      root: "styled-components",
      commonjs2: "styled-components",
      commonjs: "styled-components",
      amd: "styled-components"
    }
  },
};


module.exports = merge(prodConfig, baseConfig); // 将baseConfig和prodConfig合并为一个配置
