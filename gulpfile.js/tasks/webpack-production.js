var gulp          = require('gulp'),
    webpack       = require('webpack'),
    path          = require('path'),
    nodemon       = require('nodemon'),
    paths         = require('../config/index'),
    config        = require('../config/webpack')('production'),
    backendConfig = config.backend,
    backendConfigComp = config.backendComp,
    frontendConfig = config.frontend,
    frontendConfigComp = config.frontendComp,
    jsDest = paths.publicAssets;


/*
Common
 */
gulp.task('build', [
  'frontend-build',
  'frontend-build-comp',
  'backend-build',
  'backend-build-comp'
]);
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
gulp.task('frontend-build-comp', function(done) {
  webpack(frontendConfigComp).run(onBuild(done));
});

/*
Back end
 */
gulp.task('backend-build', function(done) {
  webpack(backendConfig).run(onBuild(done));
});
gulp.task('backend-build-comp', function(done) {
  webpack(backendConfigComp).run(onBuild(done));
});
