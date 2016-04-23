var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var replace = require('gulp-replace');
var rename = require("gulp-rename");
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var zip = require('gulp-zip');
var uglify = require('gulp-uglify');
var assign = require('lodash/object/assign');
var concat = require('gulp-concat');
var derequire = require('gulp-derequire');
var jasmine = require('gulp-jasmine');
var jasmineBrowser = require('gulp-jasmine-browser');
var GitHubApi = require('github');
var fs = require('fs');
var exec = require('child_process').exec;
var watch = require('gulp-watch');

// Transpile
// -------------------------------------------------

function transpile(infiles, outfile, outdir, extraOpts) {
  var opts = assign({}, extraOpts);
  return browserify(infiles, opts).bundle()
    .on('error', function(err) { console.error(err); this.emit('end'); })
    .pipe(source(outfile))
    .pipe(buffer())
    .pipe(gulp.dest(outdir));
}

// Build
// -------------------------------------------------

gulp.task('build', function() {
  return transpile('./src/rune.js', 'rune.js', 'tmp', { standalone: "Rune" })
});

// Test
// -------------------------------------------------

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

gulp.task('specs:browserify', ['specs:browser'], function() {
  return transpile(['tmp/rune_browser_specs.js'], 'rune_browserify_specs.js', 'tmp', {})
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

gulp.task('test:browser', ['build', 'specs:browserify'], function() {

  // first listen for changes on source files and recompile
  gulp.watch('src/**/*.js', ['build']);
  gulp.watch('test/**/*.js', ['specs:browserify']);

  // then listen for changes on recompiled files and restart server.
  var compiledFiles = ['tmp/rune.js', 'tmp/rune_browserify_specs.js'];
  gulp.src(compiledFiles)
    .pipe(watch(compiledFiles))
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({port: 8888}));
});

gulp.task('test:headless', ['build', 'specs:browserify'], function() {
  return gulp.src(['tmp/rune.js', 'tmp/rune_browserify_specs.js'])
    .pipe(jasmineBrowser.specRunner({console: true}))
    .pipe(jasmineBrowser.headless());
});

gulp.task("test:node", ['specs:node'], function() {
  return gulp.src(['tmp/rune_node_specs.js']).pipe(jasmine({
    verbose: true,
    includeStackTrace:true
  }));
});

// Benchmark
// -------------------------------------------------

gulp.task("benchmark", ['build'], function() {
  var benchmark = require('./test/benchmark');
  benchmark();
});

// GitHub
// -------------------------------------------------

gulp.task('publish:minify', ['build'], function() {
  return gulp.src(['tmp/rune.js'])
    .pipe(uglify())
    .on('error', function(err) { console.error(err); })
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('tmp'))
});

gulp.task('publish:zip', ['publish:minify'], function() {
  var p = require('./package.json')
  return gulp.src(['tmp/rune.js', 'tmp/rune.min.js'])
    .pipe(zip('github-'+p.version+'.zip'))
    .pipe(gulp.dest('tmp'));
});

gulp.task('publish', ['publish:zip'], function() {

  var creds = require('./credentials.json');
  var p = require('./package.json');

  var github = new GitHubApi({
    version: '3.0.0',
    //debug: true,
    protocol: 'https',
    host: 'api.github.com',
    timeout: 5000,
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'user-agent': 'GPMP-GitHub-App'
    }
  });

  github.authenticate({
    type: "oauth",
    token: creds.github_token
  });

  github.releases.createRelease({
    owner: 'runemadsen',
    repo: 'rune.js',
    tag_name: p.version,
    body: 'See [CHANGELOG.md](CHANGELOG.md) for details'
  }, function (err, res) {
      if (err) {
        console.log("Could not create release")
        return;
      }
      github.releases.uploadAsset({
        owner: 'runemadsen',
        id: res.id,
        repo: 'rune.js',
        name: 'rune-'+p.version+'.zip',
        filePath: './tmp/github-'+p.version+'.zip'
      })
  });

});
