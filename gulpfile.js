/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
'use strict';

var brand = 'dashing';
var header = [
  '/*',
  ' * dashing',
  ' * @version v' + require('./package.json').version,
  ' * @link https://github.com/stanleyxu2005/dashing',
  ' * @license Apache License 2.0, see accompanying LICENSE file',
  ' */',
  ''].join('\n')
var output_dir = 'dist';

var gulp = require('gulp');
var tool = {
  concat: require('gulp-concat-util'),
  fs: require('fs'),
  htmlmin: require('gulp-htmlmin'),
  minifycss: require('gulp-minify-css'),
  rename: require("gulp-rename"),
  replace: require('gulp-replace'),
  sort: require('gulp-sort'),
  sourcemaps: require('gulp-sourcemaps'),
  stripcomments: require('gulp-strip-comments'),
  stripemptylines: require('gulp-remove-empty-lines'),
  templatecache: require('gulp-angular-templatecache'),
  uglifyjs: require('gulp-uglify'),
}

gulp.task('default', ['min-css', 'min-js', 'doc'], function() {
  tool.fs.unlink('src/tpls.js');
});

// concat all css files as one
gulp.task('concat-css', function() {
  return gulp.src('src/**/*.css')
    .pipe(tool.sort()) // `gulp.src()` returns filenames in random order
    .pipe(tool.concat(brand + '.css'))
    .pipe(tool.stripcomments())
    .pipe(tool.stripemptylines())
    .pipe(tool.concat.header(header))
    .pipe(gulp.dest(output_dir));
});

// minify css file
gulp.task('min-css', ['concat-css'], function() {
  return gulp.src(output_dir + '/' + brand + '.css')
    .pipe(tool.sourcemaps.init())
    .pipe(tool.minifycss())
    .pipe(tool.concat.header(header))
    .pipe(tool.rename(brand + '.min.css'))
    .pipe(tool.sourcemaps.write('.'))
    .pipe(gulp.dest(output_dir));
});

// create angular template cache
gulp.task('pack-angular-templates', function() {
  return gulp.src('src/**/*.html')
    .pipe(tool.sort()) // `gulp.src()` returns filenames in random order
    .pipe(tool.htmlmin({removeComments: true, collapseWhitespace: true, conservativeCollapse: true}))
    .pipe(tool.templatecache('tpls.js', {module: brand}))
    .pipe(gulp.dest('src'));
});

// concat all js files as one
gulp.task('concat-js', ['pack-angular-templates'], function() {
  return gulp.src('src/**/*.js')
    .pipe(tool.sort({ // `gulp.src()` returns filenames in random order
      comparator: function(file1, file2) {
        var path = require('path');
        function l(f) { return f.path.split(path.sep).length; }
        var result = l(file1) - l(file2);
        return result === 0 ? file1.path > file2.path : result;
      }}))
    .pipe(tool.concat(brand + '.js'))
    .pipe(tool.stripcomments())
    .pipe(tool.stripemptylines())
    .pipe(tool.replace(/\s*\'use strict\';/g, ''))
    .pipe(tool.concat.header('(function(window, document, undefined) {\n\'use strict\';\n'))
    .pipe(tool.concat.footer('\n})(window, document);'))
    .pipe(tool.concat.header(header))
    .pipe(gulp.dest(output_dir));
});

// minify js file
gulp.task('min-js', ['concat-js'], function() {
  return gulp.src(output_dir + '/' + brand + '.js')
    .pipe(tool.sourcemaps.init())
    .pipe(tool.uglifyjs())
    .pipe(tool.concat.header(header))
    .pipe(tool.rename(brand + '.min.js'))
    .pipe(tool.sourcemaps.write('.'))
    .pipe(gulp.dest(output_dir));
});

// copy license and readme
gulp.task('doc', function() {
  return gulp.src(['LICENSE', '*.md'])
    .pipe(gulp.dest(output_dir));
});
