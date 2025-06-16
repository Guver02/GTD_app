const path = require('path');

module.exports = {
  entry: './src/app/index.js',

  output: {
    path: path.resolve(__dirname, 'src/public'),
    filename: 'bundle.js',
    publicPath: '/', // <--- AÑADE ESTA LÍNEA
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  mode: 'development',

  devServer: {
    port: 4000,
    open: true,
    hot: true,
    liveReload: false,
    client: {
      overlay: true,
    },
    static: {
      directory: path.join(__dirname, 'src/public'),
    },
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        proxyTimeout: 10000,
      },
    ],
    historyApiFallback: true,
  }
};
