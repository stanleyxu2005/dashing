/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts.metrics-sparkline', [
  'dashing.charts.sparkline',
  'dashing.metrics'
])
/**
 * Sparkline control with current value information on top.
 *
 * @example
 *   <metrics-sparkline-td
 *     caption="CPU usage" help="CPU usage in real time" value="50" unit="%"
 *     options-bind="sparkLineOptions" datasource-bind="sparkLineData">
 *   </metrics-sparkline-td>
 */
  .directive('metricsSparklineTd', function() {
    'use strict';
    return {
      templateUrl: 'charts/metrics-sparkline-td.html',
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
 * Sparkline control with current value information at left side.
 * todo: fix metrics block vertical alignment issue
 *
 * @example
 *   <metrics-spartkline-lr
 *     caption="CPU usage" help="CPU usage in real time" value="50" unit="%"
 *     metrics-part-class="col-md-4" chart-part-class="col-md-offset-1 col-md-7"
 *     options-bind="sparkLineOptions" datasource-bind="sparkLineData">
 *   </metrics-spartkline-lr>
 */
  .directive('metricsSparklineLr', function() {
    'use strict';
    return {
      templateUrl: 'charts/metrics-sparkline-lr.html',
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
;