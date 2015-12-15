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
 * @param options-bind - object
 * {
 *   height: string // the css height of the chart
 *   width: string // the css width of the chart
 *   data: // an array of initial data points
 *
 *   colors: array|string // optional to override bar colors
 *   static: boolean // update existing data points instead of adding new data points (default: true)
 *   rotate: boolean // rotate the bar control (default: false)
 *   yAxisSplitNum: number // the number of split ticks to be shown on y-axis (default: 3)
 *   yAxisShowMinorAxisLine: boolean // show minor axis line (default: false)
 *   yAxisLabelWidth: number // the pixels for the y-axis labels (default: 3)
 *   yAxisLabelFormatter: function // optional to override the label formatter
 *   valueFormatter: function // optional to override the value formatter
 *   barMaxWidth: number // reduce chart width, if bar actual width will exceed the value (default: 16)
 *   barMaxSpacing: number // reduce chart width, if bar actual spacing will exceed the value (default: 4)
 *   barMinWidth: number // show data zoom control, if bar width is narrower than the value (default: 7)
 *   barMinSpacing: number // show data zoom control, if bar spacing is narrower than the value (default: 1)
 *   xAxisShowLabels: boolean // show x-axis labels (default: true)
 * }
 * @param datasource-bind - array
 *   every data object is {x: string, y: number}
 *
 * @example
 *   <bar-chart
 *     options-bind="::chartOptions"
 *     datasource-bind="chartData">
 *   </bar-chart>
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
            echartScope.addDataPoints(data);
          }
        });
      },
      controller: ['$scope', '$element', function($scope, $element) {
        var use = angular.merge({
          yAxisSplitNum: 3,
          yAxisShowMinorAxisLine: false,
          yAxisLabelWidth: 60,
          yAxisLabelFormatter: $echarts.axisLabelFormatter(''),
          yBoundaryGap: [0.2, 0.2],
          static: true,
          rotate: false,
          xAxisShowLabels: true
        }, $scope.options);

        use = angular.merge({
          barMaxWidth: use.rotate ? 20 : 16,
          barMinWidth: use.rotate ? 8 : 7,
          barMaxSpacing: 4,
          barMinSpacing: 1
        }, use);

        var data = use.data;
        if (!Array.isArray(data)) {
          console.warn({message: 'Initial data is expected to be an array', data: data});
          data = data ? [data] : [];
        }
        $echarts.validateSeriesNames(use, data);

        if (!Array.isArray(use.colors) || !use.colors.length) {
          use.colors = $echarts.barChartColorRecommendation(
            use.seriesNames.length || 1);
        }
        var colors = use.colors.map(function(base) {
          return $echarts.buildColorStates(base);
        });
        var axisColor = colors.length > 1 ? '#999' : colors[0].line;

        var options = {
          height: use.height,
          width: use.width,
          tooltip: angular.merge(
            $echarts.categoryTooltip(use.valueFormatter), {
              axisPointer: {
                type: 'shadow',
                shadowStyle: {
                  color: 'rgba(225,225,225,0.3)'
                }
              }
            }),
          grid: angular.merge({
            borderWidth: 0,
            x: Math.max(15, use.yAxisLabelWidth), /* add 5px margin to avoid overlap a data point */
            x2: 15, /* increase the right margin, otherwise last label might be cropped */
            y: 15, y2: 28
          }, use.grid),
          xAxis: [{
            // dashing bar-chart does not support time as x-axis values
            axisLabel: {show: true},
            axisLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: axisColor,
                type: 'dotted'
              }
            },
            axisTick: false,
            splitLine: false
          }],
          yAxis: [{
            type: 'value',
            // todo: optional to hide y-axis
            splitNumber: use.yAxisSplitNum,
            splitLine: {
              show: use.yAxisShowMinorAxisLine,
              lineStyle: {
                color: axisColor,
                type: 'dotted'
              }
            },
            axisLine: false,
            axisLabel: {formatter: use.yAxisLabelFormatter}
          }],
          series: use.seriesNames.map(function(name, i) {
            return $echarts.makeDataSeries({
              type: 'bar',
              name: name,
              stack: true,
              colors: colors[i]
              // No need to set widths and gaps, the chart control will calculate it automatically.
            });
          }),
          // override the default color colorPalette, otherwise the colors look messy.
          color: use.colors
        };

        if (use.static) {
          delete use.visibleDataPointsNum;
        }
        $echarts.fillAxisData(options, data, use);
        if (use.static) {
          // Tell chart control only update existing data points' value.
          options.visibleDataPointsNum = -1;
        }

        if (use.rotate) {
          var axisSwap = options.xAxis;
          options.xAxis = angular.copy(options.yAxis);
          options.xAxis[0].type = options.xAxis[0].type || 'value';
          options.yAxis = axisSwap;
          options.yAxis[0].type = options.yAxis[0].type || 'category';
        }

        if (!use.xAxisShowLabels) {
          options.xAxis[0].axisLabel = false;
          options.grid.y2 = options.grid.y;
        }

        if (use.static) {
          // todo: currently the calculation can only happen at initialization stage, the chart will not response on a resizing event.
          var drawBarMinWidth = use.barMinWidth + use.barMinSpacing;
          var drawBarMaxWidth = use.barMaxWidth + use.barMaxSpacing;
          var drawAllBarMinWidth = data.length * drawBarMinWidth;
          var drawAllBarMaxWidth = data.length * drawBarMaxWidth;
          var chartHeight = parseInt(use.height);

          if (use.rotate) {
            var gridMarginY = options.grid.borderWidth * 2 + options.grid.y + options.grid.y2;
            if (chartHeight < gridMarginY + drawAllBarMinWidth) {
              console.info('Increased the height to ' + (gridMarginY + drawAllBarMinWidth) + 'px, ' +
                'because rotated bar chart does not support data zoom yet.');
              options.height = (gridMarginY + drawAllBarMinWidth) + 'px';
            } else if (chartHeight > gridMarginY + drawAllBarMaxWidth) {
              options.height = (gridMarginY + drawAllBarMaxWidth) + 'px';
            }
          } else {
            var gridMarginX = options.grid.borderWidth * 2 + options.grid.x + options.grid.x2;
            var chartControlWidth = angular.element($element[0]).children()[0].offsetWidth;
            var visibleWidthForBars = chartControlWidth - gridMarginX;

            if (drawAllBarMinWidth > 0 && drawAllBarMinWidth > visibleWidthForBars) {
              // Add a scrollbar if bar widths exceeds the minimal width
              var roundedVisibleWidthForBars = Math.floor(visibleWidthForBars / drawBarMinWidth) * drawBarMinWidth;
              options.grid.x2 += visibleWidthForBars - roundedVisibleWidthForBars;

              var scrollbarHeight = 20;
              var scrollbarGridMargin = 5;
              options.dataZoom = {
                show: true,
                end: roundedVisibleWidthForBars * 100 / drawAllBarMinWidth,
                realtime: true,
                height: scrollbarHeight,
                y: chartHeight - scrollbarHeight - scrollbarGridMargin,
                handleColor: axisColor
              };
              options.dataZoom.fillerColor =
                zrender.tool.color.alpha(options.dataZoom.handleColor, 0.08);
              options.grid.y2 += scrollbarHeight + scrollbarGridMargin * 2;
            } else if (data.length) {
              if (visibleWidthForBars > drawAllBarMaxWidth) {
                // Too few bars to fill up the whole area, so increase the right/bottom margin
                options.grid.x2 += chartControlWidth - drawAllBarMaxWidth - gridMarginX;
              }
            }
          }
        }

        $scope.echartOptions = options;
      }]
    };
  }])
;