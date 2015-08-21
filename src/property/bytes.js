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
          if (['true', '1'].indexOf(attrs.readable) !== -1) {
            var bytes = Number(raw);
            var s = ['', 'K', 'M', 'G', 'T', 'P'];
            var e = Math.floor(Math.log(bytes) / Math.log(1024));

            scope.raw = Math.floor(bytes / Math.pow(1024, e));
            scope.unit = s[e] + attrs.unit;
          } else {
            scope.unit = attrs.unit;
          }
        });
      }
    };
  })
;