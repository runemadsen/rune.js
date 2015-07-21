var gulp = require('gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var include = require('gulp-include');
var _ = require('underscore');

gulp.task("compile", function() {
  gulp.src(["vendor/**.js", "src/rune.js"])
    .pipe(include()).on('error', console.log)
    .pipe(concat('rune.js'))
    .pipe(gulp.dest("test/build"))
});

gulp.task("test", ["compile"], function() {
  connect.server({
    port: 9898,
    root: 'test'
  });
  gulp.watch("./src/**/*.js", ["compile"]);
});
