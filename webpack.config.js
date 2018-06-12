const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { VueLoaderPlugin } = require('vue-loader');

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  devtool: 'eval-source-map',
  output: {
    path: resolve('dist'),
    filename: 'jiracard.js',
    sourceMapFilename: '[file].map',
    devtoolModuleFilenameTemplate: 'webpack:///[resource-path]?[loaders]',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  externals: [nodeExternals()],

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          optimizeSSR: false,
          cacheBusting: true,
          cssSourceMap: false,
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].map',
      exclude: []
    })
  ]
}
