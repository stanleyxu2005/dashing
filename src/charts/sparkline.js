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
 *   series0Type: 'bar'|'area' // renders data series as bar or area (default: area)
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
            echartScope.addDataPoints(data);
          }
        });
      },
      controller: ['$scope', function($scope) {
        var use = angular.merge({
          color: 'rgb(0,119,215)'
        }, $scope.options);

        if (use.xAxisTypeIsTime) {
          // todo: https://github.com/ecomfe/echarts/issues/1954
          console.warn('Echarts does not have a good experience for time series, so we fallback to category.');
          use.xAxisTypeIsTime = false;
        }

        var colors = $echarts.buildColorStates(use.color);
        var options = {
          height: use.height,
          width: use.width,
          tooltip: $echarts.categoryTooltip(use.valueFormatter),
          grid: angular.merge({
            borderWidth: 1,
            x: 5, y: 5, x2: 5, /* add 5px margin to avoid overlap a data point */
            y2: 1 /* reduce to 1px, because 5px will have a thick ugly grey border */
          }, use.grid),
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

        if (use.series0Type === 'bar') {
          options.grid.borderWidth = 0;
          options.grid.y2 = 0;
          options.xAxis[0].boundaryGap = true;
          options.series[0].type = 'bar';
        }

        $echarts.fillAxisData(options, use.data, use.visibleDataPointsNum);

        $scope.echartOptions = options;
      }]
    };
  }])
;