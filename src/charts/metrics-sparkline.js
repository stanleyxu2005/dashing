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
 *     caption="CPU usage" help="CPU usage in real time"
 *     value="50" unit="%"
 *     options-bind="sparkLineOptions" datasource-bind="sparkLineData">
 *   </metrics-sparkline-td>
 */
  .directive('metricsSparklineTd', function() {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'charts/metrics-sparkline-td.html',
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