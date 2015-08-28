/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.property.bytes', [])
/**
 * Bytes as text with a human readable unit.
 *
 * @param raw number
 * @param unit string (optional)
 *
 * @example
 *  <bytes raw="1234"></bytes>
 *  <bytes raw="102400" unit="byte"></bytes>
 *  <bytes raw="102400" unit="byte" readable="true"></bytes>
 */
  .directive('bytes', function() {
    'use strict';
    return {
      restrict: 'E',
      templateUrl: 'property/bytes.html',
      scope: {
        raw: '@'
      },
      link: function(scope, elem, attrs) {
        attrs.$observe('raw', function(raw) {
          if (['true', '1'].indexOf(attrs['readable']) !== -1) {
            var hr = toHumanReadable(Number(raw));
            scope.value = hr.value;
            scope.unit = hr.modifier + attrs.unit;
          } else {
            scope.unit = attrs.unit;
          }
        });

        function toHumanReadable(value) {
          var modifier = '';
          if (value !== 0) {
            var positiveValue = Math.abs(value);
            var s = ['', 'K', 'M', 'G', 'T', 'P'];
            var e = Math.floor(Math.log(positiveValue) / Math.log(1024));
            value = Math.floor(positiveValue / Math.pow(1024, e)) * (positiveValue === value ? 1 : -1);
            modifier = s[e];
          }
          return {value: value, modifier: modifier};
        }
      }
    };
  })
;