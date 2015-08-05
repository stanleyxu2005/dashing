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
 *   height: string // the css height of the chart
 *   width: string // the css width of the chart
 *   maxDataNum: number // the maximal number of data points (of a series) in the chart (default: unlimited)
 *   tooltipFormatter: function // optional to override the tooltip formatter
 *   showDataOnLegend: boolean // show current data on legend (default: false)
 *   yAxisValuesNum: number // the number of values on y-axis (default: 3)
 *   stacked: boolean // should stack all data series (default: true)
 *   data: // an array of initial data points (will fallback to $scope.data)
 * }
 * @param datasource-bind - array of data objects
 *  every data object is {x: time|string, y: [number]}
 */
  .directive('lineChart', function() {
    'use strict';
    return {
      restrict: 'E',
      template: '<echart options="::echartOptions" data="data"></echart>',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      link: function(scope, elem) {
        var echartElem = elem.find('div')[0];
        var echartScope = angular.element(echartElem).isolateScope();

        // todo: watch can be expensive. we should find a simple way to expose the addDataPoint() method.
        scope.$watch('data', function(data) {
          echartScope.addDataPoints(data);
        });
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = angular.merge({
          stacked: true,
          yAxisValuesNum: 3
        }, $scope.options);

        var data = $echarts.splitInitialData(use.data || $scope.data, use.maxDataNum);
        var colorPalette = $echarts.colorPalette(use.seriesNames.length);
        var borderLineStyle = {
          lineStyle: {
            width: 1,
            color: '#ddd'
          }
        };
        var options = {
          height: use.height,
          width: use.width,
          tooltip: $echarts.tooltip({
            color: 'rgb(235,235,235)',
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
          grid: {
            borderWidth: 0,
            y: 20,
            x2: 5,
            y2: 23
          },
          xAxis: [{
            boundaryGap: false,
            axisLine: borderLineStyle,
            axisTick: borderLineStyle,
            axisLabel: {show: true},
            splitLine: false,
            data: data.round0.map(function(item) {
              return item.x;
            })
          }],
          yAxis: [{
            splitNumber: use.yAxisValuesNum,
            splitLine: {show: false},
            axisLine: {show: false},
            scale: use.scale
          }],
          series: [],
          // override the default color colorPalette, otherwise the colors look messy.
          color: use.seriesNames.map(function(_, i) {
            return colorPalette[i % colorPalette.length].line;
          }),
          // own properties
          xAxisDataNum: use.maxDataNum,
          initialDataRound1: data.round1
        };

        angular.forEach(use.seriesNames, function(name, i) {
          options.series.push(
            $echarts.makeDataSeries({
              name: name,
              colors: colorPalette[i % colorPalette.length],
              stack: use.stacked,
              showAllSymbol: true,
              data: data.round0.map(function(item) {
                return item.y[i];
              })
            })
          );
        });

        // todo: external font size and style should fit global style automatically (e.g. use sass)
        var titleHeight = 20;
        var legendHeight = 16;

        // Add inline chart title
        if (use.title) {
          options.title = {
            text: use.title,
            x: 0,
            y: 3
          };
          options.grid.y += titleHeight;
        }

        // Add legend if there multiple data series
        $scope.showLegend = options.series.length > 1;
        if ($scope.showLegend) {
          options.legend = {
            show: true,
            itemWidth: 8,
            data: []
          };
          angular.forEach(options.series, function(series) {
            options.legend.data.push(series.name);
          });
          options.legend.y = 6;
          if (use.title) {
            options.legend.y += titleHeight;
            options.grid.y += legendHeight;
          }
        }

        if ($scope.showLegend || use.title) {
          options.grid.y += 12;
        }

        $scope.echartOptions = options;
      }]
    };
  })
;