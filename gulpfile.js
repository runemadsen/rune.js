var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babelify = require('babelify');
var replace = require('gulp-replace');
var rename = require("gulp-rename");
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var zip = require('gulp-zip');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
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
  var bundler = browserify(infiles, opts)
    .transform(babelify, {presets: ["es2015"]})

  return bundler.bundle()
    .on('error', function(err) { console.error(err); this.emit('end'); })
    .pipe(source(outfile))

    // This is horrible make .default to root so package can be required
    // with require('rune.js') and not require('rune.js').default
    .pipe(replace("exports.default = Rune;", "module.exports = Rune;"))

    // remove requires from file because otherwise the node
    // module doesn't work.
    .pipe(derequire())
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(outdir));
}

// Build
// -------------------------------------------------

gulp.task('build:browser', function() {
  return transpile('./src/rune.js', 'rune.browser.js', 'tmp', { standalone: "Rune", debug:true })
});

gulp.task('build:node', function() {
  return transpile('./src/rune.js', 'rune.node.js', 'tmp', { bundleExternal:false, standalone: "Rune", debug:true })
});

gulp.task('build', ['build:browser', 'build:node']);


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
  return transpile(['tmp/rune_browser_specs.js'], 'rune_browserify_specs.js', 'tmp', { debug:true })
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

  // first listen for changes on source files and recompile
  gulp.watch('src/**/*.js', ['build:browser']);
  gulp.watch('test/**/*.js', ['specs:browserify']);

  // then listen for changes on recompiled files and restart server.
  var compiledFiles = ['tmp/rune.browser.js', 'tmp/rune_browserify_specs.js'];
  gulp.src(compiledFiles)
    .pipe(watch(compiledFiles))
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({port: 8888}));
});

gulp.task('test:headless', ['build:browser', 'specs:browserify'], function() {
  return gulp.src(['tmp/rune.browser.js', 'tmp/rune_browserify_specs.js'])
    .pipe(jasmineBrowser.specRunner({console: true}))
    .pipe(jasmineBrowser.headless());
});

gulp.task("test:node", ['build:node', 'specs:node'], function() {
  return gulp.src(['tmp/rune_node_specs.js']).pipe(jasmine({verbose: true, includeStackTrace:true}));
});

// NPM
// -------------------------------------------------

gulp.task('npm:dir', ['build:node', 'build:browser'], function() {
  gulp.src(['package.json', 'README.md'])
    .pipe(gulp.dest('tmp/npm'));
});

gulp.task('npm:dist', ['npm:dir'], function() {
  return gulp.src(['tmp/rune.node.js', 'tmp/rune.browser.js'])
    .pipe(gulp.dest('tmp/npm/dist'));
});

gulp.task('npm:tar', ['npm:dist'], function() {
  var p = require('./package.json')
  return gulp.src(['tmp/npm/**'], { base: "tmp"})
    .pipe(tar('node-'+p.version+'.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('tmp'));
});

gulp.task('npm:publish', ['npm:tar'], function(cb) {

  var p = require('./package.json');

  exec('npm publish tmp/node-'+p.version+'.tar.gz', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });

});

// GITHUB
// -------------------------------------------------

gulp.task('github:minify', ['build:browser'], function() {
  return gulp.src(['tmp/rune.browser.js'])
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('tmp'));
});

gulp.task('github:zip', ['github:minify'], function() {
  var p = require('./package.json')
  return gulp.src(['tmp/rune.browser.js', 'tmp/rune.browser.min.js'])
    .pipe(zip('github-'+p.version+'.zip'))
    .pipe(gulp.dest('tmp'));
});

gulp.task('github:publish', ['github:zip'], function() {

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

gulp.task('publish', ['npm:publish', 'github:publish'], function() {
  console.log("Published!");
});
