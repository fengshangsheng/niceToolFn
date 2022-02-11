module.exports = {
  resolve: {
    // 模块路径别名
    alias: {
      '@': '/src'
    },
    // 指定要解析的文件扩展名
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  module: {
    unknownContextCritical: false,
    rules: [{
      // 使用 babel-loader 来编译处理 js 和 jsx 文件
      test: /\.(js|jsx)$/,
      use: "babel-loader",
      exclude: /node_modules/
    }, {
      test: /\.(ts|tsx)?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    }]
  },
};
