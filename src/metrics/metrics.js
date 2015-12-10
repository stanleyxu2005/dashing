/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.metrics', [])
/**
 * A card component to show metric value and its meaning.
 *
 * @param caption string
 * @param value number
 * @param unit string (optional)
 * @param sub-text string (optional)
 *   A secondary text after the value unit string
 *
 * @example
 *  <metrics caption="CPU" value="99.5" unit="%"></metrics>
 *  <metrics caption="Disk Write Rate" value="500" unit="MB/s"
 *    sub-text="SSD hard disk"></metrics>
 */
  .directive('metrics', function() {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'metrics/metrics.html',
      scope: {
        caption: '@',
        help: '@',
        remarkType: '@',
        value: '@',
        unit: '@',
        unitPlural: '@',
        subText: '@'
      }
    };
  })
;