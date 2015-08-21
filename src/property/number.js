/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.property.number', [
])
/**
 * Number text with unit.
 *
 * @param number number
 * @param unit string (optional)
 *
 * @example
 *  <number number="1234"></number>
 *  <number number="102400" unit="byte"></number>
 */
  .directive('number', function() {
    'use strict';
    return {
      restrict: 'E',
      templateUrl: 'property/number.html'
    };
  })
;
