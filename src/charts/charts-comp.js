/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts-comp', [
  'dashing.charts',
  'dashing.metrics'
])
/**
 * Sparkline chart control with current value information on top.
 *
 * @example
 *   <sparkline-chart-metrics-top
 *     caption="CPU usage" help="CPU usage in real time" value="50" unit="%"
 *     options-bind="sparkLineOptions" datasource-bind="sparkLineData">
 *   </sparkline-chart-comp1>
 */
  .directive('sparklineChartMetricsTop', function() {
    'use strict';
    return {
      templateUrl: 'charts/sparkline-chart-metrics-top.html',
      restrict: 'E',
      scope: {
        caption: '@',
        help: '@',
        current: '@',
        unit: '@',
        options: '=optionsBind',
        data: '=datasourceBind'
      }
    };
  })
/**
 * Sparkline chart control with current value information at left side.
 * todo: fix metrics block vertical alignment issue
 *
 * @example
 *   <sparkline-chart-metrics-left
 *     caption="CPU usage" help="CPU usage in real time" value="50" unit="%"
 *     metrics-part-class="col-md-4" chart-part-class="col-md-offset-1 col-md-7"
 *     options-bind="sparkLineOptions" datasource-bind="sparkLineData">
 *   </sparkline-chart-metrics-left>
 */
  .directive('sparklineChartMetricsLeft', function() {
    'use strict';
    return {
      templateUrl: 'charts/sparkline-chart-metrics-left.html',
      restrict: 'E',
      scope: {
        caption: '@',
        help: '@',
        current: '@',
        unit: '@',
        smallText: '@',
        options: '=optionsBind',
        data: '=datasourceBind',
        metricsPartClass: '@',
        chartPartClass: '@'
      },
      controller: ['$timeout', function($timeout) {
        // Manually trigger a window.resize, otherwise echart will not fit the width.
        $timeout(function() {
          angular.element(window).triggerHandler('resize');
        });
      }]
    };
  })
/**
 * Line chart control with current value information on top.
 *
 * @example
 *   <line-chart-metrics-top
 *     caption="CPU usage" help="CPU usage in real time" value="50" unit="%"
 *     options-bind="lineChartOptions" datasource-bind="lineChartData">
 *   </sparkline-chart-comp1>
 */
  .directive('lineChartMetricsTop', function() {
    'use strict';
    return {
      templateUrl: 'charts/line-chart-metrics-top.html',
      restrict: 'E',
      scope: {
        caption: '@',
        help: '@',
        current: '@',
        unit: '@',
        options: '=optionsBind',
        data: '=datasourceBind'
      }
    };
  })
;