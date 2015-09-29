/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts.metrics_sparkline', [
  'dashing.charts.sparkline',
  'dashing.metrics'
])
/**
 * Sparkline control with current value information on top.
 *
 * @example
 *   <metrics-sparkline-chart-td
 *     caption="CPU usage" help="CPU usage in real time"
 *     value="50" unit="%"
 *     options-bind="sparkLineOptions" datasource-bind="sparkLineData">
 *   </metrics-sparkline-chart-td>
 */
  .directive('metricsSparklineChartTd', function() {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'charts/metrics_sparkline_td.html',
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