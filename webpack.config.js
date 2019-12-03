const path = require('path');

const config = {
  // 设置当前的打包环境：development/production
  mode: 'development',
  // 设置入口
  entry: {
    index: './index.js'
  },

  devServer: {
    // 需要监听的目录
    contentBase: 'dist',
    host: 'localhost',
    port: 12306
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-transform-runtime',
              [
                '@babel/plugin-proposal-decorators',
                {
                  'legacy': true
                }
              ]
            ]
          }
        },
        exclude: /node_modules/,
      }
    ]
  },

  output: {
    // 输出文件的名称
    filename: '[name]-bundle.js',
    // 输出文件的路径
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  }
};

module.exports = config;