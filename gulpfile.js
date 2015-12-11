/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
'use strict';

var project = require('./package.json');
var license = {
  dashing: '/*! dashing (assembled widgets) v' + project.version + ' | Apache License 2.0 | github.com/stanleyxu2005/dashing */\n',
  select2: '/*! Select2 | Apache License 2.0 | Copyright 2014 Igor Vaynberg */\n',
  select2_bootstrap: '/*! Select2 Bootstrap 3 CSS v1.4.6 | MIT License | github.com/t0m/select2-bootstrap-css */\n'
};
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
    vendor_css: [
      // files must be listed in this order
      'vendors/select2/select2.css',
      'vendors/select2-bootstrap-css/select2-bootstrap.css'
    ],
    js: 'src/*/**/*.js',
    templates: 'src/**/*.html'
  },
  temp: {
    angular_templates: 'angular-tpls.js',
    dashing_css: 'dashing.css',
    select2_css: 'select2.css',
    select2_bootstrap_css: 'select2-bootstrap.css'
  }
};

var gulp = require('gulp');
var plugin = {
  angular_templatecache: require('gulp-angular-templatecache'),
  concat: require('gulp-concat'),
  fs: require('fs'),
  header_footer: require('gulp-headerfooter'),
  js_prettify: require('gulp-js-prettify'),
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

gulp.task('default', ['min-css', 'min-js', 'doc']);

// complete all css tasks and minify css file
gulp.task('min-css', ['concat-css'], function() {
  return gulp.src(output_dir + '/' + files.output.css)
    .pipe(plugin.source_maps.init())
    /**/.pipe(plugin.minify_css())
    /**/.pipe(plugin.rename(files.output.css_min))
    .pipe(plugin.source_maps.write('.'))
    .pipe(gulp.dest(output_dir));
});

var temp_css_files = [
  files.temp.select2_css,
  files.temp.select2_bootstrap_css,
  files.temp.dashing_css];

// concat all css files as one
gulp.task('concat-css', ['concat-temp-css'], function() {
  remove_files(temp_css_files);
});

// concat all temp css files as one
gulp.task('concat-temp-css', [
  'concat-dashing-css', 'strip-select2-css', 'strip-select2-bootstrap-css'], function() {
  return gulp.src(temp_css_files)
    .pipe(plugin.concat(files.output.css))
    .pipe(gulp.dest(output_dir));
});

// concat all dashing css files as one
gulp.task('concat-dashing-css', function() {
  var task = gulp.src(files.source.css)
    .pipe(plugin.sort()) // `gulp.src()` does not guarantee file orders
    .pipe(plugin.concat(files.temp.dashing_css));
  return compact_css_temp(task, license.dashing);
});

// return a select2.css file without comments
gulp.task('strip-select2-css', function() {
  return compact_css_temp(
    gulp.src('vendors/select2/select2.css'),
    license.select2);
});

// return a select2-bootstrap.css file without comments
gulp.task('strip-select2-bootstrap-css', function() {
  return compact_css_temp(
    gulp.src('vendors/select2-bootstrap-css/select2-bootstrap.css'),
    license.select2_bootstrap);
});

function compact_css_temp(task, license) {
  return task
    .pipe(plugin.strip_comments())
    .pipe(plugin.strip_empty_lines())
    .pipe(plugin.header_footer.header(license))
    .pipe(gulp.dest('.'));
}

// complete all js tasks and minify js file
gulp.task('min-js', ['concat-js'], function() {
  return gulp.src(output_dir + '/' + files.output.js)
    .pipe(plugin.source_maps.init())
    /**/.pipe(plugin.minify_js())
    /**/.pipe(plugin.header_footer.header(license.dashing))
    /**/.pipe(plugin.rename(files.output.js_min))
    .pipe(plugin.source_maps.write('.'))
    .pipe(gulp.dest(output_dir));
});

// concat all js files as one
gulp.task('concat-js', ['pack-angular-templates'], function() {
  var result = gulp.src(files.source.js)
    .pipe(plugin.sort()) // `gulp.src()` does not guarantee file orders
    .pipe(plugin.concat(files.output.js))
    .pipe(plugin.header_footer.header([
      plugin.fs.readFileSync('src/module.js'), '',
      plugin.fs.readFileSync(files.temp.angular_templates), ''].join('\n')))
    .pipe(plugin.strip_comments())
    .pipe(plugin.js_prettify({indent_size: 2})) // strip comments will mess up the code, so we do a prettify
    .pipe(plugin.strip_empty_lines())
    .pipe(plugin.replace(/\s*'use strict';/g, ''))
    .pipe(plugin.header_footer.header('(function(window, document, undefined) {\n\'use strict\';\n'))
    .pipe(plugin.header_footer.footer('\n})(window, document);'))
    .pipe(plugin.header_footer.header(license.dashing))
    .pipe(gulp.dest(output_dir));

  remove_files([files.temp.angular_templates]);
  return result;
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
    .pipe(plugin.angular_templatecache(files.temp.angular_templates, {
      module: project.name,
      templateHeader: 'angular.module(\'<%= module %>\'<%= standalone %>).run([\'$templateCache\', function($templateCache) {\'use strict\';',
      templateBody: '$templateCache.put(\'<%= url %>\',\'<%= contents %>\');'
    }))
    .pipe(plugin.replace('\\\"', '"'))
    .pipe(gulp.dest('.'));
});

// copy license and readme
gulp.task('doc', function() {
  return gulp.src(['LICENSE', 'README.md'])
    .pipe(gulp.dest(output_dir));
});

function remove_files(files) {
  files.forEach(function(temp_file) {
    if (plugin.fs.existsSync(temp_file)) {
      plugin.fs.unlinkSync(temp_file);
    }
  });
}

// DEV: trigger build automatically when file is changed
gulp.task('watch', function() {
  gulp.watch(['src/**/*.css', 'src/**/*.js', 'src/**/*.html'], ['min-css', 'min-js']);
});

// DEV: static check before project commit
gulp.task('static', function() {
  gulp.src(['dist/*.*'])//, '!node_modules/**'])
    .pipe(require('gulp-convert-newline')({newline: 'lf'}))
    .pipe(gulp.dest('.'));
});
