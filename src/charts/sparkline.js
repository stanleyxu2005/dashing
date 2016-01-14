/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts.sparkline', [
  'dashing.charts.adapter.echarts',
  'dashing.charts.look_and_feel'
])
/**
 * Sparkline is an one data series line chart without axis labels.
 *
 * @param options-bind object
 * {
 *   height: string // the css height of the chart
 *   width: string // the css width of the chart
 *   data: array // an array of initial data points
 *
 *   color: string // optional to override line color
 *   visibleDataPointsNum: number // the maximal number of data points in the chart (default: unlimited)
 *   valueFormatter: function // function to override the representation of y-axis value
 *   xAxisTypeIsTime: boolean // use timeline as x-axis (currently disabled)
 *   series0Type: enum(bar|area) // renders data series as bar or area (default: area)
 * }
 * @param datasource-bind array
 *   every data object is {x: time|string, y: number|array}
 *
 * @example
 *   <sparkline-chart
 *     options-bind="options"
 *     datasource-bind="dataArray">
 *   </sparkline-chart>
 */
  .directive('sparklineChart', ['dashing.charts.look_and_feel', '$echarts',
    function(lookAndFeel, $echarts) {
      'use strict';

      function toEchartOptions(dsOptions) {
        var use = angular.merge({
          color: lookAndFeel.lineChartColorRecommendation(1)[0],
          yAxisBoundaryGap: [0, 0.5]
        }, dsOptions);

        if (use.xAxisTypeIsTime) {
          console.warn('Echarts does not have a good experience for time series, so we fallback to category. ' +
            'Please track https://github.com/ecomfe/echarts/issues/1954');
          use.xAxisTypeIsTime = false;
        }

        var colors = lookAndFeel.buildColorStates(use.color);
        var defaultMargin = 5; // less than 5px might crop data point
        var options = {
          height: use.height,
          width: use.width,
          tooltip: $echarts.categoryTooltip(use.valueFormatter),
          grid: angular.merge({
            borderWidth: 1,
            x: defaultMargin, y: defaultMargin, x2: defaultMargin,
            y2: 1 /* reduce to 1px, because 5px will have a thick ugly grey border */
          }, use.grid),
          xAxis: [{
            type: use.xAxisTypeIsTime ? 'time' : undefined,
            boundaryGap: false,
            axisLine: false,
            axisLabel: false,
            splitLine: false
          }],
          yAxis: [{
            boundaryGap: use.yAxisBoundaryGap,
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

        var data = use.data;
        $echarts.fillAxisData(options, data, use);

        return options;
      }

      return {
        restrict: 'E',
        template: '<echart options="::initOptions" api="api"></echart>',
        scope: {
          options: '=optionsBind',
          data: '=datasourceBind'
        },
        link: function(scope) {
          return $echarts.linkFn(scope, toEchartOptions);
        },
        controller: ['$scope', function($scope) {
          $scope.initOptions = toEchartOptions($scope.options);
        }]
      };
    }])
;