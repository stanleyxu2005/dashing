/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.util', [])

  .factory('$util', function() {
    'use strict';

    return {
      /** Convert a condition to a Bootstrap label style class */
      conditionToBootstrapLabelClass: function(condition) {
        switch (condition) {
          case 'good':
            return 'label-success';
          case 'concern':
            return 'label-warning';
          case 'danger':
            return 'label-danger';
          default:
            return 'label-default';
        }
      },
      /** Convert a condition to a css color */
      conditionToColor: function(condition) {
        switch (condition) {
          case 'good':
            return '#5cb85c';
          case 'concern':
            return '#f0ad4e';
          case 'danger':
            return '#d9534f';
          default:
            return '#aaa';
        }
      },
      /**
       * Return an array of color objects regarding the num of data series.
       */
      colorPalette: function(num) {
        var COLORS = {
          blue: 'rgb(0,119,215)',
          purple: 'rgb(110,119,215)',
          green: 'rgb(41,189,181)',
          darkRed: 'rgb(212,102,138)',
          orange: 'rgb(255,127,80)'
        };

        switch (num) {
          case 1:
            return [COLORS.blue];
          case 2:
            return [COLORS.blue, COLORS.green];
          default:
            return Object.keys(COLORS).map(function(key) {
              return COLORS[key];
            });
        }
      },
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