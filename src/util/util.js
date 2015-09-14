/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.util', [
  'dashing.util.array',
  'dashing.util.bootstrap',
  'dashing.util.color',
  'dashing.util.text'
])

  .factory('dashing.util', [
    'dashing.util.array',
    'dashing.util.bootstrap',
    'dashing.util.color',
    'dashing.util.text',
    function(array, bootstrap, color, text) {
      'use strict';

      return {
        array: array,
        bootstrap: bootstrap,
        color: color,
        text: text
      };
    }])
;