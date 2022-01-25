const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const IsDev = process.env.NODE_ENV === 'development';

const baseConfig = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      // ts-loader 用于加载解析 ts 文件
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      // 用于加载解析 less 文件
      {
        test: /\.less$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {loader: 'less-loader'},
        ]
      },

    ],
  },
  optimization: {
    minimize: true,	// 开启代码压缩
  },
};
const devConfig = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: path.join(__dirname, './src/index.ts'),
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'main.js',
  },
  plugins: [
    // 自动注入编译打包好的代码至 html
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html'),
      filename: 'index.html',
    }),
  ],
  devServer: {
    // port: 8008,		// example 的启动端口，选填
    open: true
  },
};
const proConfig = {
  mode: 'production',
  devtool: 'nosources-source-map',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: {
    'react': 'react',
    'react-dom': 'react-dom'
  },
  plugins: [
    new CleanWebpackPlugin(),	// 编译之前清空 /dist
  ],
}

module.exports = Object.assign(
  baseConfig,
  IsDev ? devConfig : proConfig
);
