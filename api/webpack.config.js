const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: {
    bundle: path.join(__dirname, './modites.js'),
  },

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },

  mode: process.env.NODE_ENV || 'production',

  watchOptions: {
    ignored: /node_modules|dist|\.js/g,
  },

  devtool: false, // CF recommends: 'cheap-module-eval-source-map',

  optimization: {
    minimize: false,
  },

  node: {
    fs: 'empty',
  },

  plugins: [new Dotenv()],

  target: 'webworker',
}
