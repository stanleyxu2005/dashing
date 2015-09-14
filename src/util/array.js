/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.util.array', [])

  .factory('dashing.util.array', function() {
    'use strict';

    return {
      /**
       * Return the array, if required length is less or equal to the array's, otherwise make a
       * copy and fill the extra positions with a default value.
       */
      alignArray: function(array, length, default_) {
        if (length <= array.length) {
          return array.slice(0, length);
        }
        var result = angular.copy(array);
        for (var i = result.length; i < length; i++) {
          result.push(default_);
        }
        return result;
      },
      /**
       * Return the array, if the required length is less or equal to the array's, otherwise
       * make a copy and fill the extra positions with a value of the array.
       */
      repeatArray: function(array, sum) {
        if (sum <= array.length) {
          return array.slice(0, sum);
        }
        var result = [];
        for (var i = 0; i < sum; i++) {
          result.push(array[i % array.length]);
        }
        return result;
      },
      /**
       * Return the array, if it is an array or return an array with one element.
       */
      ensureArray: function(value) {
        return Array.isArray(value) ? value : [value];
      }
    };
  })
;