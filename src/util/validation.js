/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.util.validation', [])

/** Validation utils */
  .factory('dashing.util.validation', function() {
    'use strict';

    return {
      /**
       * Validate a class identifier
       */
      class: function(s) {
        return /^[a-zA-Z_][a-zA-Z_\d]*(\.[a-zA-Z_][a-zA-Z_\d]*)*$/i.test(s);
      },
      /**
       * Validate an integer
       */
      integer: function(s) {
        return s == parseInt(s, 10);
      },
      /**
       * Validate a positive integer
       */
      positiveInteger: function(s) {
        var n = parseInt(s, 10);
        return s == n && n > 0;
      },
      /**
       * Validate a non-negative integer
       */
      nonNegativeInteger: function(s) {
        var n = parseInt(s, 10);
        return s == n && n >= 0;
      }
    };
  })
;