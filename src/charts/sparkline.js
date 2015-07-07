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
 *   <sparkline options-bind="sparkLineOptions" datasource-bind="sparkLineData"></sparkline>
 *
 * @param options-bind - the option object, which the following elements:
 * {
 *   height: string, // the css height of the chart
 *   width: string, // the css width of the chart
 *   maxDataNum: number, // the maximal number of data points in the chart (default: unlimited)
 *   tooltipFormatter: function // a function to specify tooltip
 *   seriesNames: [string] // name of data series in an array
 * }
 * @param datasource-bind - array of data objects
 *  every data object is {x: time|string, y: number}
 */
  .directive('sparkline', function() {
    'use strict';
    return {
      template: '<echart options="echartOptions" data="data"></echart>',
      restrict: 'E',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = $scope.options;
        var colors = $echarts.colorPalette(1)[0];
        var data = $echarts.splitDataArray($scope.data, use.maxDataNum);
        $scope.echartOptions = {
          height: use.height, width: use.width,
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
          // 5px border on left and right to fix data point
          grid: {borderWidth: 0, x: 5, y: 5, x2: 5, y2: 0},
          xAxis: [{
            boundaryGap: false,
            axisLabel: false,
            splitLine: false,
            data: data.head.map(function(item) {
              return item.x;
            })
          }],
          yAxis: [{show: false}],
          xAxisDataNum: use.maxDataNum,
          series: [$echarts.makeDataSeries({
            colors: colors, stack: true /* stack=true means fill area */,
            data: data.head.map(function(item) {
              return item.y;
            })
          })]
        };
        if (data.tail.length) {
          $scope.data = data.tail;
        }
      }]
    };
  })
;