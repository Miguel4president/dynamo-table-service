var gulp = require('gulp');
var webpack = require('webpack-stream');
var $ = require('gulp-load-plugins')();
var webpackConfig = require('./webpack.config.js');

// pull the build environment from the '--type <foo>' arg
var environment = $.util.env.type || 'development';

// base directories
var dist = 'build/';
var webpage = 'webpage/';
var circuitGame = 'circuit-game/';

// content of webpack task (task name is 'scripts')
function doWebpack(config) {
  return gulp.src(config.entry)
    .pipe(webpack(config))
    .pipe(gulp.dest(dist))
    .pipe($.size({title: 'js'}));
}

// define webpack task
gulp.task('scripts', function () {
  return doWebpack(webpackConfig(environment));
});


// define convenience build task for compiling both js and scss
gulp.task('build', ['scripts', 'scss']);

// watch for changes in js or scss, recompile
gulp.task('watch', function () {
  var config = webpackConfig('development');
  config.watch = true; // webpack has its own watch process
  doWebpack(config);

  gulp.watch(webpage + 'scss/**/*.scss', ['scss']); // define our own scss compile watch process
});
