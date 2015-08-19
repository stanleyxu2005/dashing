/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
'use strict';

var project = require('./package.json');
var header = [
  '/*',
  ' * dashing (assembled widgets)',
  ' * @version v' + project.version,
  ' * @link https://github.com/stanleyxu2005/dashing',
  ' * @license Apache License 2.0, see accompanying LICENSE file',
  ' */',
  ''].join('\n');
var output_dir = 'dist';
var files = {
  output: {
    css: project.name + '.css',
    css_min: project.name + '.min.css',
    js: project.name + '.js',
    js_min: project.name + '.min.js'
  },
  source: {
    css: 'src/**/*.css',
    js: 'src/*/**/*.js',
    templates: 'src/**/*.html'
  },
  template_js_temp: 'tpls.js'
};

var gulp = require('gulp');
var plugin = {
  cache_angular_templates: require('gulp-angular-templatecache'),
  concat: require('gulp-concat'),
  fs: require('fs'),
  header_footer: require('gulp-headerfooter'),
  minify_css: require('gulp-minify-css'),
  minify_html: require('gulp-htmlmin'),
  minify_js: require('gulp-uglify'),
  rename: require('gulp-rename'),
  replace: require('gulp-replace'),
  source_maps: require('gulp-sourcemaps'),
  strip_comments: require('gulp-strip-comments'),
  strip_empty_lines: require('gulp-remove-empty-lines'),
  // `gulp.src()` does not guarantee file orders, so we need a plugin...
  sort: require('gulp-sort')
};

gulp.task('default', ['min-css', 'min-js', 'doc'], function() {
  plugin.fs.unlink(files.template_js_temp);
});

// concat all css files as one
gulp.task('concat-css', function() {
  return gulp.src(files.source.css)
    .pipe(plugin.sort()) // `gulp.src()` does not guarantee file orders
    .pipe(plugin.strip_comments())
    .pipe(plugin.strip_empty_lines())
    .pipe(plugin.concat(files.output.css))
    .pipe(plugin.header_footer.header(header))
    .pipe(gulp.dest(output_dir));
});

// minify css file
gulp.task('min-css', ['concat-css'], function() {
  return gulp.src(output_dir + '/' + files.output.css)
    .pipe(plugin.source_maps.init())
    /**/.pipe(plugin.minify_css())
    /**/.pipe(plugin.header_footer.header(header))
    /**/.pipe(plugin.rename(files.output.css_min))
    .pipe(plugin.source_maps.write('.'))
    .pipe(gulp.dest(output_dir));
});

// create angular template cache
gulp.task('pack-angular-templates', function() {
  return gulp.src(files.source.templates)
    .pipe(plugin.sort()) // `gulp.src()` does not guarantee file orders
    .pipe(plugin.minify_html({
      removeComments: true,
      collapseWhitespace: true,
      conservativeCollapse: true
    }))
    .pipe(plugin.cache_angular_templates(files.template_js_temp, {
      module: project.name,
      templateHeader: 'angular.module(\'<%= module %>\'<%= standalone %>).run([\'$templateCache\', function($templateCache) {\'use strict\';',
      templateBody: '$templateCache.put(\'<%= url %>\',\'<%= contents %>\');'
    }))
    .pipe(plugin.replace('\\\"', '"'))
    .pipe(gulp.dest('.'));
});

// concat all js files as one
gulp.task('concat-js', ['pack-angular-templates'], function() {
  return gulp.src(files.source.js)
    .pipe(plugin.sort()) // `gulp.src()` does not guarantee file orders
    .pipe(plugin.concat(files.output.js))
    .pipe(plugin.header_footer.header([
      plugin.fs.readFileSync('src/module.js'), '',
      plugin.fs.readFileSync(files.template_js_temp), ''].join('\n')))
    .pipe(plugin.strip_comments())
    .pipe(plugin.strip_empty_lines())
    .pipe(plugin.replace(/\s*\'use strict\';/g, ''))
    .pipe(plugin.header_footer.header('(function(window, document, undefined) {\n\'use strict\';\n'))
    .pipe(plugin.header_footer.footer('\n})(window, document);'))
    .pipe(plugin.header_footer.header(header))
    .pipe(gulp.dest(output_dir));
});

// minify js file
gulp.task('min-js', ['concat-js'], function() {
  return gulp.src(output_dir + '/' + files.output.js)
    .pipe(plugin.source_maps.init())
    /**/.pipe(plugin.minify_js())
    /**/.pipe(plugin.header_footer.header(header))
    /**/.pipe(plugin.rename(files.output.js_min))
    .pipe(plugin.source_maps.write('.'))
    .pipe(gulp.dest(output_dir));
});

// copy license and readme
gulp.task('doc', function() {
  return gulp.src(['LICENSE', '*.md'])
    .pipe(gulp.dest(output_dir));
});

// DEV: trigger build automatically when file is changed
gulp.task('watch', function() {
  gulp.watch('src/**/*.css', ['min-css']);
  gulp.watch('src/**/*.js', ['min-js']);
});

// DEV: static check before project commit
gulp.task('static', function() {
  gulp.src(['dist/*.*'])//, '!node_modules/**'])
    .pipe(require('gulp-convert-newline')({newline: 'lf'}))
    .pipe(gulp.dest('.'));
});
