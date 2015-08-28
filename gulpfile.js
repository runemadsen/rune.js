//var gulp = require('gulp');
//var connect = require('gulp-connect');
//var concat = require('gulp-concat');
//var include = require('gulp-include');
//var _ = require('underscore');
//var fs = require('fs');
//var browserify = require('browserify');
//var source = require('vinyl-source-stream');
//
//gulp.task("compile", function() {
//  gulp.src(["vendor/**.js", "src/rune.js"])
//    .pipe(include()).on('error', console.log)
//    .pipe(concat('rune.js'))
//    .pipe(gulp.dest("test/build"))
//});
//
//gulp.task("test", ["compile"], function() {
//  connect.server({
//    port: 9898,
//    root: 'test'
//  });
//  gulp.watch("./src/**/*.js", ["compile"]);
//});
//
//gulp.task("vendor", function() {
//
//  browserify("browserify/virtual-dom.js")
//    .bundle()
//    .pipe(source('virtual-dom.js'))
//    .pipe(gulp.dest('./vendor'));
//
//  browserify("browserify/color.js")
//    .bundle()
//    .pipe(source('color.js'))
//    .pipe(gulp.dest('./vendor'));
//
//  browserify("browserify/bezier.js")
//    .bundle()
//    .pipe(source('bezier.js'))
//    .pipe(gulp.dest('./vendor'));
//
//})

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var babel = require("gulp-babel");
var rename = require("gulp-rename");

var libfile = './src/rune.js'

// export to common js
gulp.task("common", function() {
  return gulp.src(libfile)
    .pipe(babel())
    .pipe(rename("rune.common.js"))
    .pipe(gulp.dest("./dist"))
});

// export to amd

// export to browserify
gulp.task("browser", function() {
  browserify(libfile)
    .transform(babelify)
    .bundle()
    .pipe(source('rune.browser.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist'))
});


//function compile(watch) {
//  var bundler = watchify(browserify('./index.js', { debug: true }).transform(babel));
//
//  function rebundle() {
//    bundler.bundle()
//      .on('error', function(err) { console.error(err); this.emit('end'); })
//      .pipe(source('build.js'))
//      .pipe(buffer())
//      .pipe(gulp.dest('./build'));
//  }
//
//  if (watch) {
//    bundler.on('update', function() {
//      console.log('-> bundling...');
//      rebundle();
//    });
//  }
//
//  rebundle();
//}
//
//function watch() {
//  return compile(true);
//};

// make sure it works with package and straight es6
