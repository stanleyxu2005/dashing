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
 *   <line-chart
 *     options-bind="::chartOptions"
 *     datasource-bind="chartData">
 *   </line-chart>
 *
 * @param options-bind - the option object, which the following elements:
 * {
 *   height: string // the css height of the chart
 *   width: string // the css width of the chart
 *   seriesNames: [string] // name of data series in an array (the text will be shown in legend and tooltip as well)
 *   data: // an array of initial data points
 *
 *   colors: array|string // optional to override line colors
 *   visibleDataPointsNum: number // the maximal number of data points in the chart (default: unlimited)
 *   showLegend: boolean // show legend even when multiple data series on chart (default: true)
 *   yAxisSplitNum: number // the number of split ticks to be shown on y-axis (default: 3)
 *   yAxisShowSplitLine: boolean // show split lines on y-axis (default: true)
 *   yAxisLabelWidth: number // the pixels for the y-axis labels (default: 3)
 *   yAxisLabelFormatter: function // optional to override the label formatter
 *   valueFormatter: function // function to override the representation of y-axis value
 *   xAxisTypeIsTime: boolean // use timeline as x-axis (currently disabled)
 *   seriesStacked: boolean // should stack all data series (default: true)
 *   seriesLineSmooth: boolean // draw line of series smooth (default: false)
 * }
 * @param datasource-bind - array of data objects
 *   every data object is {x: time|string, y: [number]}
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
      link: function(scope) {
        var echartScope = scope.$$childHead;
        scope.$watch('data', function(data) {
          if (data) {
            echartScope.addDataPoints(data);
          }
        });
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = angular.merge({
          seriesStacked: true,
          seriesLineSmooth: false,
          showLegend: true,
          yAxisSplitNum: 3,
          yAxisShowSplitLine: true,
          yAxisLabelWidth: 60,
          yAxisLabelFormatter: $echarts.axisLabelFormatter('')
        }, $scope.options);

        if (use.xAxisTypeIsTime) {
          // https://github.com/ecomfe/echarts/issues/1954
          console.warn('Echarts does not have a good experience for time series, so we fallback to category.');
          use.xAxisTypeIsTime = false;
        }

        var data = use.data;
        if (!use.seriesNames) {
          var first = Array.isArray(data[0].y) ? data[0].y : [data[0].y];
          if (first.length > 1) {
            console.warn('Fallback to default series names. ' +
              'You should set `lineChartOptions.seriesNames`.');
          }
          use.seriesNames = first.map(function(_, i) {
            return 'Series ' + (i + 1);
          });
        }

        if (!Array.isArray(use.colors) || !use.colors.length) {
          use.colors = $echarts.lineChartColorRecommendation(
            use.seriesNames.length || 1);
        }
        var colors = use.colors.map(function(base) {
          return $echarts.buildColorStates(base);
        });
        var borderLineStyle = {
          length: 4,
          lineStyle: {
            width: 1,
            color: '#ddd'
          }
        };
        var options = {
          height: use.height,
          width: use.width,
          tooltip: angular.merge(
            $echarts.categoryTooltip(use.valueFormatter), {
              axisPointer: {
                type: 'line',
                lineStyle: {
                  color: 'rgb(235,235,235)',
                  width: 3,
                  type: 'dotted'
                }
              }
            }),
          dataZoom: {show: false},
          // 5px border on left and right to fix data point
          grid: {
            borderWidth: 0,
            x: use.yAxisLabelWidth,
            y: 20,
            x2: 5,
            y2: 23
          },
          xAxis: [{
            type: use.xAxisTypeIsTime ? 'time' : undefined,
            boundaryGap: false,
            axisLine: borderLineStyle,
            axisTick: borderLineStyle,
            axisLabel: {show: true},
            splitLine: false
          }],
          yAxis: [{
            splitNumber: use.yAxisSplitNum,
            splitLine: {
              show: use.yAxisShowSplitLine,
              lineStyle: {
                color: '#ddd',
                type: 'dotted'
              }
            },
            axisLine: false,
            axisLabel: {formatter: use.yAxisLabelFormatter}
          }],
          series: use.seriesNames.map(function(name, i) {
            return $echarts.makeDataSeries({
              name: name,
              colors: colors[i % colors.length],
              stack: use.seriesStacked,
              smooth: use.seriesLineSmooth,
              showAllSymbol: use.showAllSymbol
            });
          }),
          // override the default color colorPalette, otherwise the colors look messy.
          color: use.colors
        };

        $echarts.fillAxisData(options, data, use.visibleDataPointsNum);

        if (use.xAxisTypeIsTime) {
          // todo: https://github.com/ecomfe/echarts/issues/1954
          options.tooltip = $echarts.timelineTooltip(use.valueFormatter);
          angular.forEach(options.series, function(series) {
            series.showAllSymbol = true;
            series.stack = false;
          });
        }

        if (options.series.length === 1) {
          options.yAxis.boundaryGap = [0, 0.1];
        }

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
        var addLegend = options.series.length > 1 && use.showLegend;
        if (addLegend) {
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

        if (addLegend || use.title) {
          options.grid.y += 12;
        }

        $scope.echartOptions = options;
      }]
    };
  })
;