/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.filters.duration', [
  'dashing.util'
])
/**
 * Converts milliseconds to human readable duration representation.
 * */
  .filter('duration', ['dashing.util', function(util) {
    'use strict';

    return function(millis, compact) {
      return util.text.toHumanReadableDuration(millis, compact);
    };
  }])
;