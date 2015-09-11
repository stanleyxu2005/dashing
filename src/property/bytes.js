/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.property.bytes', [
  'dashing.util'
])
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
  .directive('bytes', ['$util', function($util) {
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
            var hr = $util.toHumanReadable(Number(raw), 1024);
            scope.value = hr.value;
            scope.unit = hr.modifier + attrs.unit;
          } else {
            scope.value = raw;
            scope.unit = attrs.unit;
          }
        });
      }
    };
  }])
;