/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.property.number', [
  'dashing.util'
])
/**
 * Represents a number.
 *
 * @param raw number
 *   the actual value of the number
 * @param unit string (optional)
 * @param precision integer (optional, default: 0)
 * @param readable boolean (optional)
 *   use K, M, G, T to make the number human readable (if it is true, precision will be reset to 0)
 *
 * @example
 *  <number raw="1234"></number>
 *  <number raw="102400" unit="byte"></number>
 *  <number raw="33.4455" precision="2"></number>
 *  <number raw="102400" unit="byte" readable="true"></number>
 */
  .directive('number', ['$filter', 'dashing.util', function($filter, util) {
    'use strict';
    return {
      restrict: 'E',
      templateUrl: 'property/number.html',
      scope: {
        raw: '@'
      },
      link: function(scope, elem, attrs) {
        attrs.$observe('raw', function(number) {
          if (['true', '1'].indexOf(String(attrs.readable)) !== -1) {
            var hr = util.text.toHumanReadableNumber(Number(number), 1024);
            scope.value = hr.value.toFixed(0);
            scope.unit = hr.modifier + attrs.unit;
          } else {
            scope.value = $filter('number')(number, Number(attrs.precision) || 0);
            scope.unit = attrs.unit;
          }
        });
      }
    };
  }])
;