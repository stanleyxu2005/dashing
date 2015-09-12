/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.util.text', [])

  .factory('dashing.util.text', function() {
    return {
      /**
       * Return the human readable notation of a numeric value.
       */
      toHumanReadable: function(value, base, precision) {
        var modifier = '';
        if (value !== 0) {
          if (base !== 1024) {
            base = 1000;
          }
          var positive = value > 0;
          var positiveValue = Math.abs(value);
          var s = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
          var e = Math.floor(Math.log(positiveValue) / Math.log(base));
          value = positiveValue / Math.pow(base, e);
          if (angular.isNumber(precision) && value !== Math.floor(value)) {
            value = value.toFixed(precision);
          }
          if (!positive) {
            value *= -1;
          }
          modifier = s[e];
        }
        return {value: value, modifier: modifier};
      }
    };
  })
;