const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js',
    libraryTarget: 'commonjs'
  },
  target: 'node',
  externals: [nodeExternals()],

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
