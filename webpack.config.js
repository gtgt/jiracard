const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'jiracard.js',
    sourceMapFilename: '[file].map',
    devtoolModuleFilenameTemplate: 'webpack:///[resource-path]?[loaders]',
    libraryTarget: 'commonjs'
  },
  target: 'node',
  externals: [nodeExternals()],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].map',
      exclude: []
    })
  ]
}
