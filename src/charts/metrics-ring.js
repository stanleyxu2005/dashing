/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts.metrics-ring', [
  'dashing.charts.ring',
  'dashing.metrics'
])
/**
 * Sparkline control with current value information on top.
 *
 * @example
 *   <metrics-ring-chart-td
 *     caption="CPU usage" help="CPU usage in real time"
 *     value="50" unit="%"
 *     options-bind="sparkLineOptions" datasource-bind="sparkLineData">
 *   </metrics-ring-chart-td>
 */
  .directive('metricsRingChartLr', function() {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'charts/metrics-ring-lr.html',
      scope: {
        caption: '@',
        help: '@',
        current: '@',
        unit: '@',
        subText: '@',
        options: '=optionsBind',
        data: '=datasourceBind'
      }
    };
  })
;