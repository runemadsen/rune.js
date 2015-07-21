var gulp = require('gulp');
var connect = require('gulp-connect');
var _ = require('underscore');

gulp.task("compile", function() {

})


gulp.task("test", ["compile"], function() {

});

gulp.task("server", ["compile"], function() {

  connect.server({
    port: 9898,
    root: 'build',
    fallback: 'public/index.html',
    livereload: {
      port: 35730
    }
  });
  return gulp.watch(['./templates/**/*.mustache', './templates/**/*.json', './data/**/*.json', './data/models/*.html'], ['navigation', 'assets:jst']);
});
