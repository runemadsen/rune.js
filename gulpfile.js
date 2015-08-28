var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babelify = require('babelify');
var rename = require("gulp-rename");
var zip = require('gulp-zip');
var open = require('open');
var jasmine = require('gulp-jasmine');
var jasmineBrowser = require('gulp-jasmine-browser');
var uglify = require('gulp-uglify');

var libfile = './src/rune.js'
var builddir = './dist'

// Build tasks
// -------------------------------------------------

gulp.task('build:common', function() {
  return browserify(libfile, {bundleExternal:false})
    .transform(babelify)
    .bundle()
    .pipe(source('rune.common.js'))
    .pipe(buffer())
    .pipe(gulp.dest(builddir))
});

gulp.task('build:amd', function() {
  return browserify(libfile, {bundleExternal:false})
    .transform(babelify.configure({modules:"amd"}))
    .bundle()
    .pipe(source('rune.amd.js'))
    .pipe(buffer())
    .pipe(gulp.dest(builddir))
});

gulp.task('build:browser', function() {
  return browserify(libfile)
    .transform(babelify)
    .bundle()
    .pipe(source('rune.browser.js'))
    .pipe(buffer())
    .pipe(gulp.dest(builddir))
});

gulp.task('build', ['build:common', 'build:amd', 'build:browser'], function() {});
gulp.task('minify', ['build'], function() {
  return gulp.src(builddir + '/*.js')
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(builddir));
});

gulp.task('zip', ['minify'], function() {
  var p = require('./package.json')
  return gulp.src(builddir + '/*')
    .pipe(zip('rune-'+p.version+'.zip'))
    .pipe(gulp.dest(builddir));
});

// Test tasks
// ---------------------------------------------------

gulp.task('test:common', function() {
  // TODO: use the common file and the specs to
  // test the lib as a node module
});

gulp.task("test:browser", ["build:browser"], function() {
  var testFiles = ['dist/rune.browser.js', 'node_modules/underscore/underscore.js', 'node_modules/jquery/dist/jquery.js', 'test/**/*.js'];
  gulp.src(testFiles)
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({port: 8888}));
});
