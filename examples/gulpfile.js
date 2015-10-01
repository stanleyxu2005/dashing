/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
'use strict';

var gulp = require('gulp');
var plugin = {
  concat: require('gulp-concat'),
};

gulp.task('default', ['deps-js-min', 'deps-css-min'], function() {
});

// concat all js files as one
gulp.task('deps-js-min', ['deps-js'], function() {
  return gulp.src([
    'node_modules/angular/angular.min.js',
    'node_modules/angular-animate/angular-animate.min.js',
    'node_modules/angular-cookies/angular-cookies.min.js',
    'node_modules/angular-smart-table/dist/smart-table.min.js',
    'node_modules/angular-strap/dist/angular-strap.min.js',
    'node_modules/angular-strap/dist/angular-strap.tpl.min.js',
    'node_modules/angular-ui-router/release/angular-ui-router.min.js',
    'node_modules/angular-ui-select/select.min.js',
    //'node_modules/highcharts-release/adapters/standalone-framework.js',
    //'node_modules/highcharts-release/highcharts.js',
    'node_modules/moment/min/moment.min.js',
    'node_modules/underscore/underscore-min.js',
    'node_modules/dashing-deps/echarts/**/echarts-all.min.js'])
    .pipe(plugin.concat('vendors.min.js'))
    .pipe(gulp.dest('vendors'));
});

// concat all js files as one
gulp.task('deps-js', function() {
  return gulp.src([
    'node_modules/angular/angular.js',
    'node_modules/angular-animate/angular-animate.js',
    'node_modules/angular-cookies/angular-cookies.js',
    'node_modules/angular-smart-table/dist/smart-table.js',
    'node_modules/angular-strap/dist/angular-strap.js',
    'node_modules/angular-strap/dist/angular-strap.tpl.js',
    'node_modules/angular-ui-router/release/angular-ui-router.js',
    'node_modules/angular-ui-select/select.js',
    //'node_modules/highcharts-release/adapters/standalone-framework.src.js',
    //'node_modules/highcharts-release/highcharts.src.js',
    'node_modules/moment/moment.js',
    'node_modules/underscore/underscore.js',
    'node_modules/dashing-deps/echarts/**/echarts-all.js'])
    .pipe(plugin.concat('vendors.js'))
    .pipe(gulp.dest('vendors'));
});

// concat all css files as one minifized
gulp.task('deps-css-min', ['deps-css', 'deps-fonts-bootstrap', 'deps-fonts-roboto'], function() {
  return gulp.src([
    'node_modules/angular-motion/dist/angular-motion.min.css',
    'node_modules/angular-ui-select/select.min.css',
    'node_modules/bootstrap/dist/css/bootstrap.min.css'])
    .pipe(plugin.concat('vendors.min.css'))
    .pipe(gulp.dest('vendors'));
});

// concat all css files as one
gulp.task('deps-css', function() {
  return gulp.src([
    'node_modules/angular-motion/dist/angular-motion.css',
    'node_modules/angular-ui-select/select.css',
    'node_modules/bootstrap/dist/css/bootstrap.css'])
    .pipe(plugin.concat('vendors.css'))
    .pipe(gulp.dest('vendors'));
});

// copy fonts to styles
gulp.task('deps-fonts-bootstrap', function() {
  return gulp.src([
    'node_modules/bootstrap/dist/fonts/*.*'])
    .pipe(gulp.dest('fonts'));
});

// copy fonts to styles
gulp.task('deps-fonts-roboto', function() {
  return gulp.src(['node_modules/dashing-deps/roboto/**/*.*'])
    .pipe(gulp.dest('fonts/roboto'));
});
