/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
'use strict';

var gulp = require('gulp');
var plugin = {
  concat: require('gulp-concat'),
  minify_css: require('gulp-clean-css'),
  minify_js: require('gulp-uglify'),
  rename: require('gulp-rename'),
  replace: require('gulp-replace'),
  source_maps: require('gulp-sourcemaps')
};

gulp.task('default', ['deps-js-min', 'deps-css-min']);

// concat all js files as one
gulp.task('deps-js-min', ['deps-js'], function() {
  return gulp.src('vendors/vendors.js')
    .pipe(plugin.source_maps.init())
    /**/.pipe(plugin.minify_js())
    /**/.pipe(plugin.rename('vendors.min.js'))
    .pipe(plugin.source_maps.write('.'))
    .pipe(gulp.dest('vendors'));
});

// concat all js files as one
gulp.task('deps-js', function() {
  return gulp.src([
    // dashing required libraries
    'node_modules/angular/angular.js',
    'node_modules/angular-animate/angular-animate.js',
    'node_modules/angular-sanitize/angular-sanitize.js',
    'node_modules/angular-smart-table/dist/smart-table.js',
    'node_modules/angular-strap/dist/angular-strap.js',
    'node_modules/angular-strap/dist/angular-strap.tpl.js',
    'node_modules/ui-select/dist/select.js',
    'node_modules/dashing-deps/echarts/**/echarts-all.js',
    //'node_modules/jquery/dist/jquery.js',
    //'node_modules/bootstrap/dist/js/bootstrap.js',
    // not dashing required libraries
    //'node_modules/highcharts-release/adapters/standalone-framework.src.js',
    //'node_modules/highcharts-release/highcharts.src.js',
    'node_modules/angular-ui-router/release/angular-ui-router.js',
    'node_modules/moment/moment.js',
    'node_modules/underscore/underscore.js'])
    .pipe(plugin.concat('vendors.js'))
    .pipe(plugin.replace(/\/\*#\s*sourceMappingURL=.*\.map\s*\*\//g, ''))
    .pipe(gulp.dest('vendors'));
});

// create a minified version
gulp.task('deps-css-min', ['deps-css'], function() {
  return gulp.src('vendors/vendors.css')
    .pipe(plugin.source_maps.init())
    /**/.pipe(plugin.minify_css())
    /**/.pipe(plugin.rename('vendors.min.css'))
    .pipe(plugin.source_maps.write('.'))
    .pipe(gulp.dest('vendors'));
});

// concat all css files as one
gulp.task('deps-css', ['deps-fonts'], function() {
  return gulp.src([
    // dashing required libraries
    'node_modules/bootstrap/dist/css/bootstrap.css',
    'node_modules/bootstrap-additions/dist/bootstrap-additions.css',
    'node_modules/angular-motion/dist/angular-motion.css',
    'node_modules/ui-select/dist/select.css'])
    .pipe(plugin.concat('vendors.css'))
    .pipe(plugin.replace(/\/\*#\s*sourceMappingURL=.*\.map\s*\*\//g, ''))
    .pipe(gulp.dest('vendors'));
});

// copy fonts
gulp.task('deps-fonts', ['deps-fonts-bootstrap', 'deps-fonts-roboto']);

// copy bootstrap fonts to fonts
gulp.task('deps-fonts-bootstrap', function() {
  return gulp.src([
    'node_modules/bootstrap/dist/fonts/*.*'])
    .pipe(gulp.dest('fonts'));
});

// copy roboto fonts to fonts
gulp.task('deps-fonts-roboto', function() {
  return gulp.src(['node_modules/dashing-deps/roboto/**/*.*'])
    .pipe(gulp.dest('fonts/roboto'));
});
