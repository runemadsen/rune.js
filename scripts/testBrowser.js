const JasmineCore = require('jasmine-core');
const opn = require('opn');
const connect = require('connect');
const serveStatic = require('serve-static');
const fs = require('fs');
const glob = require("glob-all");
const build = require('./build');

const filenames = glob.sync([
  'test/browser.js',
  'test/matchers.js',
  'test/helpers.js',
  'test/both/**/*.js',
  'test/browser/**/*.js'
]);
const scripts = filenames.map((f) => {
  return `<script src="${f}" type="text/javascript"></script>`
});

const scriptsBundle = scripts.join('\n');
const template = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Jasmine Spec Runner</title>
    <script src="dist/rune.js" type="text/javascript"></script>
    <script src="node_modules/lodash/index.js" type="text/javascript"></script>
    <script src="node_modules/jasmine-core/lib/jasmine-core/jasmine.js" type="text/javascript"></script>
    <script src="node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js" type="text/javascript"></script>
    <script src="node_modules/jasmine-core/lib/jasmine-core/boot.js" type="text/javascript"></script>
    <link rel="stylesheet" type="text/css" href="node_modules/jasmine-core/lib/jasmine-core/jasmine.css" />
    ${scriptsBundle}
  </head>
  <body>
  </body>
</html>`

build(() => {

  let server = connect();

  // serve test files
  server.use('/test', serveStatic('test'));

  // serve jasmine files
  server.use('/node_modules', serveStatic('node_modules'));

  // serve rune file
  server.use('/dist', serveStatic('dist'));

  // serve index.html
  server.use(function(req, res) {
    res.writeHeader(200, {"Content-Type": "text/html"});
    res.write(template);
    res.end();
  });

  console.log('Opening browser ...');

  // run server and open in browser
  server.listen(9786, function() {
    opn('http://localhost:9786');
  });

});
