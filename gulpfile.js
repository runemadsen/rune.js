var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babelify = require('babelify');
var rename = require("gulp-rename");
var zip = require('gulp-zip');
var uglify = require('gulp-uglify');
var del = require('del');
var watchify = require('watchify');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var jasmine = require('gulp-jasmine');

var builddir = './dist';

// Build
// -------------------------------------------------

function compile(infiles, outfile, outdir,  extraOpts, watch) {

  var opts = assign({}, watchify.args, extraOpts);
  var bundler = browserify(infiles, opts).transform(babelify.configure({sourceMaps:false}));

  //if(watch) {
  //  bundler = watchify(bundler)
  //}

  function rebundle() {
    return bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source(outfile))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(outdir));
  }

  //if(watch) {
  //  bundler.on('update', function() {
  //    console.log('-> bundling...');
  //    rebundle();
  //  });
  //}

  return rebundle();
}

gulp.task('build:browser', function() {
  return compile('./src/rune.js', 'rune.browser.js', builddir, { debug:true }, false)
});

gulp.task('build:common', function() {
  return compile('./src/rune.js', 'rune.common.js', builddir, { debug:true, bundleExternal:false }, false)
});

gulp.task('build', ['build:common', 'build:browser']);

// Minify
// -------------------------------------------------

gulp.task('minify:clean', function (cb) {
  del([builddir + '*min.js'], cb);
});

gulp.task('minify', ['build', 'minify:clean'], function() {
  return gulp.src([builddir + '/*.js', '!' + builddir + '/*.min.js'])
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(builddir));
});

// Release
// -------------------------------------------------

gulp.task('release', ['minify'], function() {
  var p = require('./package.json')
  return gulp.src(builddir + '/*')
    .pipe(zip('rune-'+p.version+'.zip'))
    .pipe(gulp.dest(builddir));
});

// Test
// ---------------------------------------------------

gulp.task('build:specs', function() {
  return compile('test/specs_shared/index.js', 'shared.js', './test/lib', { debug:true }, false)
});

gulp.task('build:specs:browser', function() {
  return compile('test/specs_browser/index.js', 'browser.js', './test/lib', { debug:true }, false)
});

gulp.task("test", ['build:browser', 'build:specs', 'build:specs:browser'], function() {
  gulp.watch('src/**/*.js', ['build:browser']);
  gulp.watch('test/specs_shared/**/*.js', ['build:specs']);
  gulp.watch('test/specs_browser/**/*.js', ['build:specs:browser']);
  connect.server({
    port: 8888
  });
});

gulp.task("test:node", ['build:common', 'build:specs'], function() {
  return gulp.src(['./dist/rune.common.js', './test/lib/shared.js']).pipe(jasmine({verbose: true, includeStackTrace:true}));
});
