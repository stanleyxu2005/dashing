/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.util.validation', [])

/** Validation utils */
  .factory('dashing.util.validation', function() {
    'use strict';

    var self = {
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
        return /^-?\d+$/.test(s);
      },
      /**
       * Validate an integer and in a specified range
       */
      integerInRange: function(s, min, max) {
        if (self.integer(s)) {
          s = Number(s);
          return (isNaN(min) || (s >= min)) && (isNaN(max) || (s <= max));
        }
        return false;
      }
    };
    return self;
  })
;