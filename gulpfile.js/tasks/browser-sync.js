var browserSync = require('browser-sync'),
    config      = require('../config/jade'),
    gulp        = require('gulp');

var config = {
  server: {
    baseDir: config.publicTemp
  },
  files: ['**/*.html']
};

gulp.task('browser-sync', ['jade'], function() {
  return browserSync(config);
});