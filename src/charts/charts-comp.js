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
 *   <sparkline-chart-comp1
 *     caption="CPU usage" help="CPU usage in real time" value="50" unit="%"
 *     options-bind="sparkLineOptions" data-bind="sparkLineData">
 *   </sparkline-chart-comp1>
 */
  .directive('sparklineChartComp1', function() {
    'use strict';
    return {
      templateUrl: 'charts/charts-comp-sparklinechartcomp1.html',
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
 *   <sparkline-chart-comp2
 *     caption="CPU usage" help="CPU usage in real time" value="50" unit="%"
 *     options-bind="sparkLineOptions" data-bind="sparkLineData">
 *   </sparkline-chart-comp2>
 */
  .directive('sparklineChartComp2', function() {
    'use strict';
    return {
      templateUrl: 'charts/charts-comp-sparklinechartcomp2.html',
      restrict: 'E',
      scope: {
        caption: '@',
        help: '@',
        current: '@',
        unit: '@',
        smallText: '@',
        options: '=optionsBind',
        data: '=datasourceBind',
        metricsStyleFix: '@'
      }
    };
  })
;