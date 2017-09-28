const path = require('path');
const glob = require("glob-all");
const readFiles = require('read-multiple-files');
const fs = require('fs');
const Jasmine = require('jasmine');

const filenames = glob.sync([
  'test/node.js',
  'test/matchers.js',
  'test/helpers.js',
  'test/both/**/*.js',
  'test/node/**/*.js'
]);

let jasmine = new Jasmine();
jasmine.loadConfig({
  spec_dir: '.',
  spec_files: filenames
});
jasmine.execute();
