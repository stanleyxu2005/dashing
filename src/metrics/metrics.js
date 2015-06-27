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
 *  <metrics caption="Send Throughput" value="2250" unit="msgs/s" small-text="Avg: 1000 msgs/s"></metrics>
 */
  .directive('metrics', function() {
    'use strict';
    return {
      templateUrl: 'metrics/metrics.html',
      restrict: 'E',
      scope: {
        caption: '@',
        help: '@',
        value: '@',
        unit: '@',
        smallText: '@'
      }
    };
  })
;