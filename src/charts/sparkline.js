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
 *   data: // an array of initial data points
 *
 *   color: string // optional to override line color
 *   visibleDataPointsNum: number // the maximal number of data points in the chart (default: unlimited)
 *   valueFormatter: function // function to override the representation of y-axis value
 *   xAxisTypeIsTime: boolean // use timeline as x-axis (currently disabled)
 * }
 * @param datasource-bind - array of data objects
 *   every data object is {x: time|string, y: number|array}
 */
  .directive('sparklineChart', ['$echarts', function($echarts) {
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
        scope.$watch('data', function(data) {
          if (data) {
            echartScope.addDataPoints(
              $echarts.firstSeriesData(data));
          }
        });
      },
      controller: ['$scope', function($scope) {
        var use = angular.merge({
          color: 'rgb(0,119,215)',
          yAxisSplitNum: 3,
          yAxisLabelWidth: 60,
          valueLabelPosition: null,
          rotate: false
        }, $scope.options);
        if (use.xAxisTypeIsTime) {
          // https://github.com/ecomfe/echarts/issues/1954
          console.warn('Echarts does not have a good experience for time series, so we fallback to category.');
          use.xAxisTypeIsTime = false;
        }

        var colors = $echarts.buildColorStates(use.color);
        var options = {
          height: use.height,
          width: use.width,
          tooltip: $echarts.categoryTooltip(use.valueFormatter),
          dataZoom: {show: false},
          // data point's radius is 5px, so we leave 5px border on left/right/top to avoid overlap.
          grid: {
            borderWidth: 1, x: 5, y: 5, x2: 5,
            y2: 1 /* set 5px will have a thick ugly grey border */
          },
          xAxis: [{
            type: use.xAxisTypeIsTime ? 'time' : undefined,
            boundaryGap: false,
            axisLabel: false,
            splitLine: false
          }],
          yAxis: [{
            boundaryGap: [0, 0.1],
            show: false
          }],
          series: [$echarts.makeDataSeries({
            colors: colors,
            stack: true /* stack=true means fill area */
          })]
        };

        $echarts.fillAxisData(options, use.data, use.visibleDataPointsNum);

        if (use.xAxisTypeIsTime) {
          // todo: https://github.com/ecomfe/echarts/issues/1954
          options.tooltip = $echarts.timelineTooltip(use.valueFormatter);
          options.series[0].showAllSymbol = true;
          options.series[0].stack = false;
        }

        $scope.echartOptions = options;
      }]
    };
  }])
;