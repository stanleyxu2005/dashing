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
 * This widget is a composite of <sparkline-chart> and <metrics>.
 *
 * @param options-bind object
 * @param datasource-bind object
 * @param caption string (optional)
 * @param help string (optional)
 * @param value number (optional)
 * @param unit string (optional)
 * @param sub-text string (optional)
 *
 * @example
 *   <metrics-sparkline-chart-td
 *     caption="CPU usage" help="CPU usage in real time"
 *     value="50" unit="%"
 *     sub-text="2 of 4 processors"
 *     options-bind="sparkLineOptions"
 *     datasource-bind="sparkLineData">
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