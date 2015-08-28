var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babelify = require('babelify');
var rename = require("gulp-rename");
var zip = require('gulp-zip');
var connect = require('gulp-connect');
var open = require('open');
var jasmine = require('gulp-jasmine');

var libfile = './src/rune.js'
var builddir = './dist'

// Build tasks
// -------------------------------------------------

gulp.task('build:common', function() {
  browserify(libfile, {bundleExternal:false})
    .transform(babelify)
    .bundle()
    .pipe(source('rune.common.js'))
    .pipe(buffer())
    .pipe(gulp.dest(builddir))
});

gulp.task('build:amd', function() {
  browserify(libfile, {bundleExternal:false})
    .transform(babelify.configure({modules:"amd"}))
    .bundle()
    .pipe(source('rune.amd.js'))
    .pipe(buffer())
    .pipe(gulp.dest(builddir))
});

gulp.task('build:browser', function() {
  browserify(libfile)
    .transform(babelify)
    .bundle()
    .pipe(source('rune.browser.js'))
    .pipe(buffer())
    .pipe(gulp.dest(builddir))
});

gulp.task('build', ['build:common', 'build:amd', 'build:browser'], function() {});

gulp.task('zip', ['build'], function() {
  var p = require('./package.json')
  return gulp.src(builddir + '/*')
    .pipe(zip('rune-'+p.version+'.zip'))
    .pipe(gulp.dest(builddir));
});

// Test tasks
// ---------------------------------------------------

var testfiles = 'test/spec/**/*.js';
var testdir = 'test/'

gulp.task('test:build', function() {
  return gulp.src('test/spec/rune.js')
    .pipe(babel())
    .pipe(rename("specs.js"))
    .pipe(gulp.dest(testdir));
});

gulp.task('test', ['test:build'], function () {
  return gulp.src('test/specs.js')
    .pipe(jasmine());
});

//gulp.task("test:browser", ["build:browser"], function() {
//  connect.server({
//    port: 9898,
//    root: '.'
//  });
//  open("http://localhost:9898/test");
//  gulp.watch("./src/**/*.js", ["build:browser"]);
//});
