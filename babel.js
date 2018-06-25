var fs = require('fs');
var browserify = require('browserify');
var babelify = require('babelify');
var scssify = require('scssify');
//bundle
var bundle = {
  js: './client/js/bundle.js',
  min: './client/js/bundle.min.js'
};
browserify({
  debug: true
})
  .transform(babelify)
  .transform(scssify, {
    autoInject: true,
    autoInject: 'verbose',
    autoInject: {
      verbose: false,
      // If true the <style> tag will be prepended to the <head>
      prepend: false
    },
    export: false,
    sass: {
      importer: 'custom-importers.js',
      importerFactory: 'custom-importer-factory.js',
      sourceMapEmbed: true,
      sourceMapContents: true,
      outputStyle: 'compressed'
    },
    postcss: {
      autoprefixer: {
        browsers: ['last 2 versions']
      }
    }
  })
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

browserify({
  debug: true
})
  .transform(babelify)
  .transform(scssify, {
    autoInject: true,
    autoInject: 'verbose',
    autoInject: {
      verbose: false,
      // If true the <style> tag will be prepended to the <head>
      prepend: false
    },
    export: false,
    sass: {
      importer: 'custom-importers.js',
      importerFactory: 'custom-importer-factory.js',
      sourceMapEmbed: true,
      sourceMapContents: true,
      outputStyle: 'compressed'
    },
    postcss: {
      autoprefixer: {
        browsers: ['last 2 versions']
      }
    }
  })
  .require('./src/top.js', { entry: true })
  .bundle()
  .on('error', function(err) {
    console.log('Error: ' + err.message);
  })
  .pipe(fs.createWriteStream(top.js));
