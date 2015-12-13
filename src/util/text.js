/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.util.text', [])

  .factory('dashing.util.text', function() {
    'use strict';

    return {
      /**
       * Return the human readable number notation.
       */
      toHumanReadableNumber: function(value, base, digits) {
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
          if (digits > 0 && value !== Math.floor(value)) {
            value = value.toFixed(digits);
          }
          if (!positive) {
            value *= -1;
          }
          modifier = s[e];
        }
        return {value: value, modifier: modifier};
      },
      /**
       * Return the human readable duration notation.
       */
      toHumanReadableDuration: function(millis, compact) {
        var x = parseInt(millis, 10);
        if (isNaN(x)) {
          return millis;
        }

        var units = [
          {label: ' ms', mod: 1000},
          {label: compact ? 's' : ' secs', mod: 60},
          {label: compact ? 'm' : ' mins', mod: 60},
          {label: compact ? 'h' : ' hours', mod: 24},
          {label: compact ? 'd' : ' days', mod: 7},
          {label: compact ? 'w' : ' weeks', mod: 52}
        ];
        var duration = [];

        for (var i = 0; i < units.length; i++) {
          var unit = units[i];
          var t = x % unit.mod;
          if (t !== 0) {
            var unitLabel = unit.label;
            if (t === 1 && unitLabel.length > ' ms'.length) {
              unitLabel = unitLabel.slice(0, -1);
            }
            duration.unshift({label: unitLabel, value: t});
          }
          x = (x - t) / unit.mod;
        }

        duration = duration.slice(0, 2);
        if (duration.length > 1 && duration[1].label === ' ms') {
          duration = [duration[0]];
        }
        return duration.map(function(piece) {
          return piece.value + piece.label;
        }).join(compact ? ' ' : ' and ');
      }
    };
  })
;