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
var assign = require('lodash.assign');
var concat = require('gulp-concat');
var connect = require('gulp-connect');

var builddir = './dist';

// Build
// -------------------------------------------------

function compile(outfile, extraOpts, watch) {

  var opts = assign({}, watchify.args, extraOpts);
  var bundler = browserify('./src/rune.js', opts).transform(babelify);

  //if(watch) {
  //  bundler = watchify(bundler)
  //}

  function rebundle() {
    return bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source(outfile))
      .pipe(buffer())
      .pipe(gulp.dest(builddir));
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
  return compile('rune.browser.js', { debug:true }, false)
});

gulp.task('build:common', function() {
  return compile('rune.common.js', { debug:true, bundleExternal:false }, false)
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
  return browserify('test/spec/specs.js', { debug: true }).transform(babelify)
    .bundle()
    .on('error', function(err) { console.error(err); this.emit('end'); })
    .pipe(source('specs.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./test/lib/'));
});

gulp.task("test", ['build:browser', 'build:specs'], function() {
  gulp.watch('src/**/*.js', ['build:browser']);
  gulp.watch('test/spec/**/*.js', ['build:specs']);
  connect.server({
    port: 8888
  });
});
