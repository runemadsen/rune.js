var gulp = require('gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var include = require('gulp-include');
var _ = require('underscore');
var fs = require('fs');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

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

gulp.task("vendor", function() {

  browserify("browserify/virtual-dom.js")
    .bundle()
    .pipe(source('virtual-dom.js'))
    .pipe(gulp.dest('./vendor'));

  browserify("browserify/color.js")
    .bundle()
    .pipe(source('color.js'))
    .pipe(gulp.dest('./vendor'));

  browserify("browserify/bezier.js")
    .bundle()
    .pipe(source('bezier.js'))
    .pipe(gulp.dest('./vendor'));

})
