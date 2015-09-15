var gulp          = require('gulp'),
    webpack       = require('webpack'),
    path          = require('path'),
    nodemon       = require('nodemon'),
    paths         = require('../config/index'),
    browserSync   = require('browser-sync'),
    jsDest = paths.publicAssets;

//Default
gulp.task('default', ['run']);

/*
Common
 */
gulp.task('watch', ['frontend-watch', 'backend-watch', 'testbin-watch']);
function onBuild(done) {
  return function(err, stats) {
    if (err) {
      console.log('Error', err);
    }
    browserSync.reload();
    console.log(stats.toString());
    if (done) {
      done();
    }
  };
}


/*
TestBin
 */
gulp.task('testbin-watch', function() {
  var config = require('../config/webpack')('dev');
  var testbin = config.testbin;
  webpack(testbin).watch(100, onBuild());
});


/*
Frontend
 */
gulp.task('frontend-watch', function() {
  var config = require('../config/webpack')('dev');
  var frontendConfig = config.frontend;
  webpack(frontendConfig).watch(100, onBuild());
});


/*
Back end
 */
gulp.task('backend-watch', function() {
  var config = require('../config/webpack')('dev');
  var backendConfig = config.backend;
  webpack(backendConfig).watch(100, function(err, stats) {
    onBuild()(err, stats);
    nodemon.restart();
  });
});

/*
Runner
 */
gulp.task('run', ['backend-watch', 'frontend-watch', 'testbin-watch', 'browser-sync'], function() {
  nodemon({
    execMap: {
      js: 'node'
    },
    script: path.join(jsDest, '/te-flow-node'),
    ignore: ['*'],
    ext: 'noop'
  }).on('restart', function() {
    console.log('Restarted!');
  });
});