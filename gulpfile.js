var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babel = require('gulp-babel');
var babelify = require('babelify');
var rename = require("gulp-rename");
var zip = require('gulp-zip');
var uglify = require('gulp-uglify');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var jasmine = require('gulp-jasmine');
var jasmineBrowser = require('gulp-jasmine-browser');

// Build
// -------------------------------------------------

function compile(infiles, outfile, outdir, extraOpts) {

  var opts = assign({}, extraOpts);
  var bundler = browserify(infiles, opts)
    .transform(babelify.configure({sourceMaps:false}));

  return bundler.bundle()
    .on('error', function(err) { console.error(err); this.emit('end'); })
    .pipe(source(outfile))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(outdir));
}

gulp.task('build:browser', function() {
  return compile('./src/rune.js', 'rune.browser.js', 'dist', { debug:true })
});

gulp.task('build:node', function() {
  return compile('./src/rune.js', 'rune.node.js', 'dist', { bundleExternal:false, standalone: "default", debug:true })
});

gulp.task('build', ['build:browser', 'build:node']);

// THESE SHOULD BE REWRITTEN TO PUBLISH DIRECTLY TO GITHUB
// AND NPM
// Minify
// -------------------------------------------------

/*gulp.task('minify', ['build'], function() {
  return gulp.src(['dist/rune.browser.js', 'dist/rune.node.js'])
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('dist'));
});*/

// Release
// -------------------------------------------------

/*gulp.task('release', ['minify'], function() {
  var p = require('./package.json')
  return gulp.src('dist/*')
    .pipe(zip('rune-'+p.version+'.zip'))
    .pipe(gulp.dest('dist'));
});*/

// Test
// ---------------------------------------------------

gulp.task('specs:browser', function() {
  return gulp.src([
    'test/matchers.js',
    'test/helpers.js',
    'test/shared/**/*.js',
    'test/browser/**/*.js'
  ])
  .pipe(concat('rune_browser_specs.js'))
  .pipe(gulp.dest('tmp'));
});

gulp.task('specs:browserify', function() {
  return compile(['tmp/rune_browser_specs.js'], 'rune_browserify_specs.js', 'tmp', { debug:true })
});

gulp.task('specs:node', function() {
  return gulp.src([
    'test/init_node.js',
    'test/matchers.js',
    'test/helpers.js',
    'test/shared/**/*.js',
    'test/node/**/*.js'
  ])
  .pipe(concat('rune_node_specs.js'))
  .pipe(gulp.dest('tmp'));
});

gulp.task('test:browser', ['build:browser', 'specs:browserify'], function() {
  return gulp.src(['dist/rune.browser.js', 'tmp/rune_browserify_specs.js'])
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({port: 8888}));
});

gulp.task("test:node", ['build:node', 'specs:node'], function() {
  return gulp.src(['tmp/rune_node_specs.js']).pipe(jasmine({verbose: true, includeStackTrace:true}));
});
