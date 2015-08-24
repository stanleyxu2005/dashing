/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts.sparkline', [
  'dashing.charts.echarts'
])
/**
 * Sparkline is an one data series line chart without axis labels.
 *
 * @example
 *   <sparkline-chart
 *     options-bind="::chartOptions"
 *     datasource-bind="chartData">
 *   </sparkline-chart>
 *
 * @param options-bind - the option object, which the following elements:
 * {
 *   height: string // the css height of the chart
 *   width: string // the css width of the chart
 *   maxDataNum: number // the maximal number of data points in the chart (default: unlimited)
 *   tooltipFormatter: function // optional to override the tooltip formatter
 *   xAxisType: ''|'time // empty sting or 'category' is string, 'time' need to feed x-axis data as date objects
 *   data: // an array of initial data points (will fallback to $scope.data)
 * }
 * @param datasource-bind - array of data objects
 *   every data object is {x: time|string, y: number}
 */
  .directive('sparklineChart', function() {
    'use strict';

    return {
      restrict: 'E',
      template: '<echart options="::echartOptions"></echart>',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      link: function(scope) {
        var echartScope = scope.$$childHead;

        // todo: watch can be expensive. we should find a simple way to expose the addDataPoint() method.
        scope.$watch('data', function(data) {
          if (data) {
            echartScope.addDataPoints(data);
          }
        });
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = $scope.options;
        var data = $echarts.splitInitialData(use.data || $scope.data, use.maxDataNum);
        var colors = $echarts.colorPalette(1)[0];

        // todo: https://github.com/ecomfe/echarts/issues/1954
        // for timeline x-axis, without showing all symbols no symbol will be shown.
        use.showAllSymbol = use.showAllSymbol || (use.xAxisType === 'time');
        use.stacked = use.stacked && (use.xAxisType !== 'time');

        var options = {
          height: use.height,
          width: use.width,
          tooltip: $echarts.tooltip({
            formatter: use.tooltipFormatter || $echarts
              .tooltipFirstSeriesFormatter(use.valueFormatter)
          }),
          dataZoom: {show: false},
          // data point's radius is 5px, so we leave 5px border on left/right/top to avoid overlap.
          grid: angular.merge({
            borderWidth: 1, x: 5, y: 5, x2: 5,
            y2: 1 /* set 5px will have a thick ugly grey border */
          }, use.grid),
          xAxis: [{
            type: use.xAxisType,
            boundaryGap: false,
            axisLabel: false,
            splitLine: false
          }],
          yAxis: [{
            boundaryGap: [0, 0.15],
            show: false,
            scale: use.scale
          }],
          series: [$echarts.makeDataSeries({
            colors: colors,
            stack: true /* stack=true means fill area */
          })],
          // own properties
          xAxisDataNum: use.maxDataNum,
          dataPointsQueue: data.newer
        };

        $echarts.fillAxisData(options, data.older);
        if (use.xAxisType === 'time') {
          // todo: https://github.com/ecomfe/echarts/issues/1954
          options.tooltip = $echarts.timelineTooltip();
          options.series[0].showAllSymbol = true;
          options.series[0].stack = false;
        }

        $scope.echartOptions = options;
      }]
    };
  })
;