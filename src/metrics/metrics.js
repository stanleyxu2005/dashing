/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.metrics', [])
/**
 * A card component to show metric value and its meaning.
 *
 * @example
 *  <metrics caption="Send Throughput" value="2250" unit="msgs/s"></metrics>
 *  <metrics caption="Send Throughput" value="2250" unit="msgs/s" sub-text="Average value: 1000 msgs/s"></metrics>
 */
  .directive('metrics', function() {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'metrics/metrics.html',
      scope: {
        caption: '@',
        help: '@',
        value: '@',
        unit: '@',
        subText: '@'
      }
    };
  })
;