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
 * @param unit string (optional. You can also set unit-plural)
 * @param sub-text string (optional)
 *   A secondary text after the value unit string
 * @param help string (optional. Show a remark icon right to the caption)
 *
 * @example
 *  <metrics caption="CPU" value="99.5" unit="%"></metrics>
 *  <metrics caption="Disk Write Rate" value="500" unit="MB/s"
 *    sub-text="SSD hard disk"></metrics>
 *  <metrics caption="Scaned" value="10" unit="device" unit-plural="devices"></metrics>
 */
  .directive('metrics', function() {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'metrics/metrics.html',
      scope: {
        caption: '@',
        value: '@',
        unit: '@',
        unitPlural: '@',
        subText: '@',
        help: '@',
        remarkType: '@',
        clickHelp: '&'
      }
    };
  })
;