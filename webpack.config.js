const HtmlWebpackPlugin = require('html-webpack-plugin'),
      ExtractTextPlugin = require('extract-text-webpack-plugin'),
      webpack = require('webpack'),
      path = require("path");

module.exports = {
  devtool: 'source-map',
  devServer: {
    hot: true,
    inline: true,
    progress: true,
    contentBase: path.join(__dirname, 'build'),
    watchContentBase: true
  },
  entry: {
    'main': [
      path.resolve(__dirname, 'src/main.js'),
      path.resolve(__dirname, 'src/index.html'),
      path.resolve(__dirname, 'src/css/styles.css')
    ]
  },
  output: {
    path: path.resolve(__dirname, "build/"),
    filename: "bundle.js"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      filename: 'index.html'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: [/node-modules/],
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: '/node_modules/',
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  }
};
