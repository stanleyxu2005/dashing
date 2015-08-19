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
          echartScope.addDataPoints(data);
        });
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = $scope.options;
        var data = $echarts.splitInitialData(use.data || $scope.data, use.maxDataNum);
        var colors = $echarts.colorPalette(1)[0];

        $scope.echartOptions = {
          height: use.height,
          width: use.width,
          tooltip: $echarts.tooltip({
            formatter: use.tooltipFormatter ?
              use.tooltipFormatter :
              $echarts.tooltipFirstSeriesFormatter(
                use.valueFormatter || function(value) {
                  return value;
                }
              )
          }),
          dataZoom: {show: false},
          // data point's radius is 5px, so we leave 5px border on left/right/top to avoid overlap.
          grid: angular.merge({
            borderWidth: 1, x: 5, y: 5, x2: 5,
            y2: 1 /* set 5px will have a thick ugly grey border */
          }, use.grid),
          xAxis: [{
            boundaryGap: false,
            axisLabel: false,
            splitLine: false,
            data: data.older.map(function(item) {
              return item.x;
            })
          }],
          yAxis: [{
            show: false,
            scale: use.scale
          }],
          series: [$echarts.makeDataSeries({
            colors: colors,
            stack: true /* stack=true means fill area */,
            data: data.older.map(function(item) {
              return Array.isArray(item.y) ? item.y[0] : item.y;
            })
          })],
          // own properties
          xAxisDataNum: use.maxDataNum,
          dataPointsQueue: data.newer
        };
      }]
    };
  })
;