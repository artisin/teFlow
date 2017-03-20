const _             = require('lodash');
const webpack       = require('webpack');
const nodeExternals = require('webpack-node-externals');
const dev = process.env.NODE_ENV === 'dev';

const base = {
  entry: {
    'te-flow': './lib/index.js'
  },
  devtool: dev ? '#eval-source-map' : 'source-map',
  output: {
    path: './dist/',
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel-loader']
    }]
  },
  plugins: dev ? [new webpack.NoEmitOnErrorsPlugin()]
               : [
                 new webpack.optimize.OccurrenceOrderPlugin(true),
                 new webpack.LoaderOptionsPlugin({
                   minimize: true,
                   debug: false
                 })
               ]
};

const node = _.defaultsDeep({}, base);
node.target = 'node';
node.externals = [nodeExternals()];

const web = _.defaultsDeep({}, base);
web.target = 'web';
web.output.filename = '[name]-browser.js';

const webMin = _.defaultsDeep({}, base);
webMin.target = 'web';
webMin.output.filename = '[name]-browser.min.js';
if (!dev) {
  webMin.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = dev ? [node] : [node, web, webMin];