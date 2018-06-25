var fs = require('fs');
var browserify = require('browserify');
var babelify = require('babelify');
var uglifyjs = require('uglify-js');
var watchify = require('watchify');

//bundle
var bundle = {
  js: './client/js/bundle.js',
  min: './client/js/bundle.min.js'
};
var b = browserify({
  debug: true,
  cache: {},
  packageCache: {},
  plugin: [watchify]
});
b.transform(babelify)
  .require('./src/main.js', { entry: true })
  .bundle()
  .on('error', function(err) {
    console.log('Error: ' + err.message);
  })
  .pipe(fs.createWriteStream(bundle.js));

//top
var top = {
  js: './client/js/top.js',
  min: './client/js/top.min.js'
};
b.transform(babelify)
  .require('./src/top.js', { entry: true })
  .bundle()
  .on('error', function(err) {
    console.log('Error: ' + err.message);
  })
  .pipe(fs.createWriteStream(top.js));
