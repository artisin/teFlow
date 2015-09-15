var gulp          = require('gulp'),
    webpack       = require('webpack'),
    path          = require('path'),
    nodemon       = require('nodemon'),
    paths         = require('../config/index'),
    config        = require('../config/webpack')('production'),
    backendConfig = config.backend,
    frontendConfig = config.frontend,
    jsDest = paths.publicAssets;


/*
Common
 */
gulp.task('build', ['frontend-build', 'backend-build']);
function onBuild(done) {
  return function(err, stats) {
    if (err) {
      console.log('Error', err);
    }
    else {
      console.log(stats.toString());
    }
    if (done) {
      done();
    }
  };
}

/*
Frontend
 */
gulp.task('frontend-build', function(done) {
  webpack(frontendConfig).run(onBuild(done));
});

/*
Back end
 */
gulp.task('backend-build', function(done) {
  webpack(backendConfig).run(onBuild(done));
});
