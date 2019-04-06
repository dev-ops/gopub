const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    app: ['babel-polyfill', './src/main.js']
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.scss'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      src: resolve('src'),
      assets: resolve('src/assets'),
      common: resolve('src/common'),
      store: resolve('src/store'),
      pages: resolve('src/pages'),
      plugins: resolve('src/plugins'),
      components: resolve('src/components')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/i,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/i,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
        exclude: resolve('node_modules')
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/i,
        loader: 'url-loader',
        query: {
          limit: 1000,
          name: utils.assetsPath('images/[contenthash:8].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        loader: 'url-loader',
        query: {
          limit: 1000,
          name: utils.assetsPath('fonts/[contenthash:8].[ext]')
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};
