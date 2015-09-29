/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.util', [
  'dashing.util.array',
  'dashing.util.bootstrap',
  'dashing.util.color',
  'dashing.util.text',
  'dashing.util.validation'
])

  .factory('dashing.util', [
    'dashing.util.array',
    'dashing.util.bootstrap',
    'dashing.util.color',
    'dashing.util.text',
    'dashing.util.validation',
    function(array, bootstrap, color, text, validation) {
      'use strict';

      return {
        array: array,
        bootstrap: bootstrap,
        color: color,
        text: text,
        validation: validation
      };
    }])
;