var gulp            = require('gulp'),
    config          = require('../config/jade'),
    jade            = require('gulp-jade');

gulp.task('jade', function() {
  return gulp.src(config.src)
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(config.publicTemp));
});
