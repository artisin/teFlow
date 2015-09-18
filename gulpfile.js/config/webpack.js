var path            = require('path'),
    paths           = require('./'),
    DeepMerge       = require('deep-merge'),
    webpack         = require('webpack');
var fs = require('fs');


module.exports = function(env) {
  var jsSrc = path.resolve(paths.sourceAssets),
      jsDest = paths.publicAssets,
      publicPath = './';

  /*
  Helpers
   */
  var deepmerge = DeepMerge(function(target, source, key) {
    if(target instanceof Array) {
      return [].concat(target, source);
    }
    return source;
  });

  /*
  Common
   */
  var defaultConfig = {
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loaders: ['babel']
        }
      ]
    }
  };
  var config = function(overrides) {
    return deepmerge(defaultConfig, overrides || {});
  };

  /*
  Enviroment
   */
  if (env !== 'production') {
    // defaultConfig.devtool = '#eval-source-map';
    defaultConfig.debug = true;
  }

  /*
  TestBin Config
   */
  var testBin = config({
    entry: './src/.dist/_js/testBin.js',
    output: {
      path: './src/.dist',
      filename: 'testBin-compiled.js'
    }
  });

  /*
  Front End Config
   */
  var frontend = config({
    entry: './src/js/te-flow.js',
    output: {
      path: jsDest,
      filename: 'te-flow.browser.js',
      library: 'teFlow',
      libraryTarget: 'umd'
    }
  });
  var frontendComp = config(deepmerge(frontend, {
    output: {
      filename: 'te-flow.browser.compressed.js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        mangle: {
          except: ['$super', '$', 'exports', 'require']
        }
      })
    ]
  }));

  /*
  Back End Config
   */
  var nodeModules = {};
  fs.readdirSync('node_modules')
    .filter(function(x) {
      return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
      nodeModules[mod] = 'commonjs ' + mod;
    });

  var backend = config({
    entry: './src/js/te-flow.js',
    target: 'node',
    output: {
      path: jsDest,
      filename: 'te-flow.js',
      library: 'teFlow',
      libraryTarget: 'umd'
    },
    node: {
      __dirname: true,
      __filename: true
    },
    externals: nodeModules
  });
  var backendComp = config(deepmerge(backend, {
    output: {
      filename: 'te-flow.compressed.js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        mangle: {
          except: ['$super', '$', 'exports', 'require']
        }
      })
    ]
  }));

  return {
    backend: backend,
    backendComp: backendComp,
    frontend: frontend,
    frontendComp: frontendComp,
    testbin: testBin
  };
};
