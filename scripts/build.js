const path = require('path')
const webpack = require('webpack');

const webpackConfig = {
  entry: './src/rune.js',
  output: {
    libraryTarget: "var",
    library: "Rune",
    path: path.join(process.cwd(), 'dist'),
    filename: 'rune.js'
  }
}

webpack(webpackConfig, (err, stats) => {

  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.error(info.errors);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings)
  }

  console.log('Rune.js build complete')
});
