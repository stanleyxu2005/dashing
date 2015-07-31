/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
'use strict';

var brand = 'dashing';
var projs = require('./package.json');
var header = [
  '/*',
  ' * dashing',
  ' * @version v' + projs.version,
  ' * @link https://github.com/stanleyxu2005/dashing',
  ' * @license Apache License 2.0, see accompanying LICENSE file',
  ' */',
  ''].join('\n');
var output_dir = 'dist';
var output_brand_prefix = output_dir + '/' + brand;

var gulp = require('gulp');
var tool = {
  concat: require('gulp-concat'),
  fs: require('fs'),
  headerfooter: require('gulp-headerfooter'),
  htmlmin: require('gulp-htmlmin'),
  minifycss: require('gulp-minify-css'),
  rename: require('gulp-rename'),
  replace: require('gulp-replace'),
  sort: require('gulp-sort'),
  sourcemaps: require('gulp-sourcemaps'),
  stripcomments: require('gulp-strip-comments'),
  stripemptylines: require('gulp-remove-empty-lines'),
  templatecache: require('gulp-angular-templatecache'),
  uglifyjs: require('gulp-uglify')
};

gulp.task('default', ['min-css', 'min-js', 'doc'], function() {
  tool.fs.unlink('src/tpls.js');
});

// concat all css files as one
gulp.task('concat-css', function() {
  return gulp.src('src/**/*.css')
    .pipe(tool.sort()) // `gulp.src()` does not aware file orders
    .pipe(tool.concat(brand + '.css'))
    .pipe(tool.stripcomments())
    .pipe(tool.stripemptylines())
    .pipe(tool.headerfooter.header(header))
    .pipe(gulp.dest(output_dir));
});

// minify css file
gulp.task('min-css', ['concat-css'], function() {
  return gulp.src(output_brand_prefix + '.css')
    .pipe(tool.sourcemaps.init())
    .pipe(tool.minifycss())
    .pipe(tool.headerfooter.header(header))
    .pipe(tool.rename(brand + '.min.css'))
    .pipe(tool.sourcemaps.write('.'))
    .pipe(gulp.dest(output_dir));
});

// create angular template cache
gulp.task('pack-angular-templates', function() {
  return gulp.src('src/**/*.html')
    .pipe(tool.sort()) // `gulp.src()` does not aware file orders
    .pipe(tool.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      conservativeCollapse: true
    }))
    .pipe(tool.templatecache('tpls.js', {
      module: brand,
      templateHeader: 'angular.module(\'<%= module %>\'<%= standalone %>).run([\'$templateCache\', function($templateCache) {\'use strict\';',
      templateBody: '$templateCache.put(\'<%= url %>\',\'<%= contents %>\');'
    }))
    .pipe(tool.replace('\\\"', '"'))
    .pipe(gulp.dest('src'));
});

// concat all js files as one
gulp.task('concat-js', ['pack-angular-templates'], function() {
  return gulp.src('src/*/**/*.js')
    .pipe(tool.sort()) // `gulp.src()` does not aware file orders
    .pipe(tool.concat(brand + '.js'))
    .pipe(tool.headerfooter.header([
      tool.fs.readFileSync('src/module.js'), '',
      tool.fs.readFileSync('src/tpls.js'), ''].join('\n')))
    .pipe(tool.stripcomments())
    .pipe(tool.stripemptylines())
    .pipe(tool.replace(/\s*\'use strict\';/g, ''))
    .pipe(tool.headerfooter.header('(function(window, document, undefined) {\n\'use strict\';\n'))
    .pipe(tool.headerfooter.footer('\n})(window, document);'))
    .pipe(tool.headerfooter.header(header))
    .pipe(gulp.dest(output_dir));
});

// minify js file
gulp.task('min-js', ['concat-js'], function() {
  return gulp.src(output_brand_prefix + '.js')
    .pipe(tool.sourcemaps.init())
    .pipe(tool.uglifyjs())
    .pipe(tool.headerfooter.header(header))
    .pipe(tool.rename(brand + '.min.js'))
    .pipe(tool.sourcemaps.write('.'))
    .pipe(gulp.dest(output_dir));
});

// copy license and readme
gulp.task('doc', function() {
  return gulp.src(['LICENSE', '*.md'])
    .pipe(gulp.dest(output_dir));
});