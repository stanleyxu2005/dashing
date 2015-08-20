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
 *   tooltipFormatter: function // optional to override the tooltip formatter
 *   yAxisValuesNum: number // the number of values on y-axis (default: 3)
 *   yAxisLabelWidth: number // the pixels for the y-axis labels (default: 3)
 *   yAxisLabelFormatter: function // optional to override the label formatter
 *   barMinWidth: number // when bar width is narrower than the value, data zoom control will be shown (default: 14)
 *   barMinSpacing: number // when bar spacing is narrower than the value, data zoom control will be shown (default: 4)
 *   color: string // optional to override bar color
 *   data: // an array of initial data points (will fallback to $scope.data)
 * }
 * @param datasource-bind - array of data objects
 *   every data object is {x: time|string, y: [number]}
 */
  .directive('barChart', function() {
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
      controller: ['$scope', '$element', '$echarts', function($scope, $element, $echarts) {
        var use = angular.merge({
          barMinWidth: 14,
          barMinSpacing: 4,
          color: $echarts.colorPalette(0)[0].line,
          yAxisValuesNum: 3,
          yAxisLabelWidth: 60
        }, $scope.options);

        var data = use.data;
        var colors = $echarts.buildColorStates(use.color);
        var options = {
          height: use.height,
          width: use.width,
          ignoreContainerResizeEvent: true,
          tooltip: $echarts.tooltip({
            formatter: use.tooltipFormatter ?
              use.tooltipFormatter :
              $echarts.tooltipFirstSeriesFormatter(
                use.valueFormatter || function(value) {
                  return value;
                }
              )
          }),
          grid: angular.merge({
            borderWidth: 0, x: use.yAxisLabelWidth, y: 15, x2: 5, y2: 28
          }, use.grid),
          xAxis: [{
            axisLabel: {show: true},
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false},
            data: data.map(function(item) {
              return item.x;
            })
          }],
          yAxis: [{
            splitNumber: use.yAxisValuesNum,
            splitLine: {show: false},
            axisLine: {show: false},
            axisLabel: {formatter: use.yAxisLabelFormatter},
            scale: use.scale
          }],
          series: [$echarts.makeDataSeries({
            colors: colors,
            type: 'bar',
            data: data.map(function(item) {
              return Array.isArray(item.y) ? item.y[0] : item.y;
            })
          })],
          // own properties
          xAxisDataNum: use.maxDataNum
        };

        var gridWidth = options.grid.borderWidth * 2 + options.grid.x + options.grid.x2;
        var allBarVisibleWidth = data.length * (use.barMinWidth + use.barMinSpacing) - use.barMinSpacing;
        var chartMaxWidth = $element[0].offsetParent.offsetWidth;

        if (allBarVisibleWidth > 0 && allBarVisibleWidth + gridWidth > chartMaxWidth) {
          var scrollbarHeight = 20;
          var scrollbarPadding = 5;
          options.dataZoom = {
            show: true,
            barWidth: use.barMinWidth,
            barGap: use.barMinSpacing,
            barCategoryGap: use.barMinSpacing,
            end: Math.floor((chartMaxWidth - gridWidth) * 100 / allBarVisibleWidth),
            zoomLock: true,
            height: scrollbarHeight,
            y: parseInt(use.height) - scrollbarHeight - scrollbarPadding,
            handleColor: colors.line,
            dataBackgroundColor: colors.area,
            fillerColor: zrender.tool.color.alpha(colors.line, 0.2)
          };
          options.grid.y2 += scrollbarHeight + scrollbarPadding * 2;
        }

        $scope.echartOptions = options;
      }]
    };
  })
;