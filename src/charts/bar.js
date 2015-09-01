/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts.bar', [
  'dashing.charts.echarts'
])
/**
 * Bar chart control.
 *
 * The width of the chart will be calculated by the number bars. If its too narrow to show all bars,
 * the chart will have a data zoom control to scroll the value bars.
 *
 * todo: support multiple series (stacked and not stacked)
 *
 * @example
 *   <bar-chart
 *     options-bind="::chartOptions"
 *     datasource-bind="chartData">
 *   </bar-chart>
 *
 * @param options-bind - the option object, which the following elements:
 * {
 *   height: string // the css height of the chart
 *   width: string // the css width of the chart
 *   data: // an array of initial data points
 *
 *   color: string // optional to override bar color
 *   yAxisSplitNum: number // the number of split ticks to be shown on y-axis (default: 3)
 *   yAxisLabelWidth: number // the pixels for the y-axis labels (default: 3)
 *   yAxisLabelFormatter: function // optional to override the label formatter
 *   valueFormatter: function // optional to override the value formatter
 *   barWidth: number // when bar width is narrower than the value, data zoom control will be shown (default: 14)
 *   barSpacing: number // when bar spacing is narrower than the value, data zoom control will be shown (default: 4)
 * }
 * @param datasource-bind - array of data objects
 *   every data object is {x: string, y: number}
 */
  .directive('barChart', ['$echarts', function($echarts) {
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
              // todo: if multiple data series is supported, this must be changed.
              $echarts.firstSeriesData(data));
          }
        });
      },
      controller: ['$scope', '$element', function($scope, $element) {
        var use = angular.merge({
          barWidth: 14,
          barSpacing: 4,
          color: '#ff7f50',
          yAxisSplitNum: 3,
          yAxisLabelWidth: 60
        }, $scope.options);

        var colors = $echarts.buildColorStates(use.color);
        var options = {
          height: use.height,
          width: use.width,
          tooltip: $echarts.categoryTooltip(use.valueFormatter),
          grid: {
            borderWidth: 0,
            x: use.yAxisLabelWidth,
            y: 15,
            x2: 5,
            y2: 28
          },
          xAxis: [{
            // dashing bar-chart does not support time as x-axis values
            axisLabel: {show: true},
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false}
          }],
          yAxis: [{
            // todo: optional to hide y-axis
            splitNumber: use.yAxisSplitNum,
            splitLine: {show: false},
            axisLine: {show: false},
            axisLabel: {formatter: use.yAxisLabelFormatter}
          }],
          series: [$echarts.makeDataSeries({
            colors: colors,
            type: 'bar',
            barWidth: use.barWidth,
            barMaxWidth: use.barWidth,
            barGap: use.barSpacing
          })]
        };

        var data = use.data;
        if (!Array.isArray(data)) {
          console.warn({message: 'Initial data is expected to be an array', data: data});
          data = data ? [data] : [];
        }
        $echarts.fillAxisData(options, data);

        // todo: the chart will not response on resizing
        var gridWidth = options.grid.borderWidth * 2 + options.grid.x + options.grid.x2 + 4;
        var allBarVisibleWidth = data.length * (use.barWidth + use.barSpacing) - use.barSpacing;
        var chartMaxWidth = angular.element($element[0]).children()[0].offsetWidth;

        if (allBarVisibleWidth > 0 && allBarVisibleWidth + gridWidth > chartMaxWidth) {
          var scrollbarHeight = 20;
          var scrollbarPadding = 5;
          options.dataZoom = {
            show: true,
            end: Math.floor((chartMaxWidth - gridWidth) * 100 / allBarVisibleWidth),
            zoomLock: true,
            height: scrollbarHeight,
            y: parseInt(use.height) - scrollbarHeight - scrollbarPadding,
            handleColor: colors.line,
            fillerColor: zrender.tool.color.alpha(colors.line, 0.08)
          };
          options.grid.y2 += scrollbarHeight + scrollbarPadding * 2;
        } else if (data.length) {
          options.grid.x2 += chartMaxWidth - allBarVisibleWidth - gridWidth;
        }

        $scope.echartOptions = options;
      }]
    };
  }])
;