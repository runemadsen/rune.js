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



gulp.task("browserify", function() {

  browserify({
    entries : [
      "node_modules/virtual-dom/diff.js",
      "node_modules/virtual-dom/patch.js",
      "node_modules/virtual-dom/create-element.js",
      "node_modules/virtual-dom/h.js",
      "node_modules/virtual-dom/virtual-hyperscript/svg.js"
    ]
  }).bundle()
    .pipe(source('virtual-dom.js'))
    .pipe(gulp.dest('./vendor'));

})
