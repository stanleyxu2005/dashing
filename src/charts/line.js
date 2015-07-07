/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts.line', [
  'dashing.charts.echarts'
])
/**
 * Line chart control.
 *
 * @example
 *   <line-chart options-bind="lineChartOptions" datasource-bind="lineChartData"></line-chart>
 *
 * @param options-bind - the option object, which the following elements:
 * {
 *   height: string, // the css height of the chart
 *   width: string, // the css width of the chart
 *   maxDataNum: number, // the maximal number of data points (of a series) in the chart (default: unlimited)
 *   tooltipFormatter: function // a function to specify tooltip,
 *   yAxisValuesNum: number // the number of values on y-axis (default: 3)
 *   stacked: boolean // should stack all data series (default: true)
 * }
 * @param datasource-bind - array of data objects
 *  every data object is {x: time|string, y: [number]}
 */
  .directive('lineChart', function() {
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
        var data = $echarts.splitDataArray($scope.data, use.maxDataNum);
        var colorPalette = $echarts.colorPalette(use.seriesNames.length);
        var borderLineStyle = {lineStyle: {width: 1, color: '#ccc'}};
        var options = {
          height: use.height, width: use.width,
          tooltip: $echarts.tooltip({
            color: 'rgba(235,235,235,.75)',
            formatter: use.tooltipFormatter ?
              use.tooltipFormatter :
              $echarts.tooltipAllSeriesFormatter(
                use.valueFormatter || function(value) {
                  return value;
                }
              )
          }),
          dataZoom: {show: false},
          // 5px border on left and right to fix data point
          grid: {borderWidth: 0, y: 10, x2: 5, y2: 22},
          xAxis: [{
            boundaryGap: false,
            axisLine: borderLineStyle,
            axisTick: borderLineStyle,
            axisLabel: {show: true},
            splitLine: false,
            data: data.head.map(function(item) {
              return item.x;
            })
          }],
          yAxis: [{
            splitNumber: use.yAxisValuesNum || 3,
            splitLine: {show: false},
            axisLine: {show: false}
          }],
          xAxisDataNum: use.maxDataNum,
          series: [],
          // override the default color colorPalette, otherwise the colors look messy.
          color: use.seriesNames.map(function(_, i) {
            return colorPalette[i % colorPalette.length].line;
          })
        };
        angular.forEach(use.seriesNames, function(name, i) {
          options.series.push(
            $echarts.makeDataSeries({
              name: name,
              colors: colorPalette[i % colorPalette.length],
              stack: use.hasOwnProperty('stacked') ? use.stacked : true,
              showAllSymbol: true,
              data: data.head.map(function(item) {
                return item.y[i];
              })
            })
          );
        });
        if (options.series.length > 1) {
          options.legend = {show: true, itemWidth: 8, data: []};
          angular.forEach(options.series, function(series) {
            options.legend.data.push(series.name);
          });
          options.grid.y = 30;
        }
        $scope.echartOptions = options;
        if (data.tail.length) {
          $scope.data = data.tail;
        }
      }]
    };
  })
;