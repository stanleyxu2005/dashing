/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts.bar', [
  'dashing.charts.adapter.echarts',
  'dashing.charts.look_and_feel',
  'dashing.util'
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
 *   margin: {left: number, right: number, top: number, bottom: number} // override the margin values
 * }
 * @param datasource-bind - array
 *   every data object is {x: string, y: number}
 *
 * @example
 *   <bar-chart
 *     options-bind="options"
 *     datasource-bind="dataArray">
 *   </bar-chart>
 */
  .directive('barChart', ['dashing.charts.look_and_feel', 'dashing.util', '$echarts',
    function(lookAndFeel, util, $echarts) {
      'use strict';

      function toEchartOptions(dsOptions, scope) {
        var use = angular.merge({
          yAxisSplitNum: 3,
          yAxisShowMinorAxisLine: false,
          yAxisLabelWidth: 60,
          yAxisLabelFormatter: $echarts.axisLabelFormatter(''),
          static: true,
          rotate: false,
          xAxisShowLabels: true,
          margin: {left: undefined, right: undefined, top: undefined, bottom: undefined}
        }, dsOptions);

        use = angular.merge({
          barMaxWidth: use.rotate ? 20 : 16,
          barMaxSpacing: use.rotate ? 5 : 4,
          barMinWidth: use.rotate ? 6 : 4,
          barMinSpacing: use.rotate ? 2 : 1
        }, use);

        var data = use.data;
        if (!Array.isArray(data)) {
          console.warn({message: 'Initial data is expected to be an array', data: data});
          data = data ? [data] : [];
        }
        $echarts.validateSeriesNames(use, data);

        if (!Array.isArray(use.colors) || !use.colors.length) {
          use.colors = lookAndFeel.barChartColorRecommendation(use.seriesNames.length || 1);
        }
        var colors = use.colors.map(function(base) {
          return lookAndFeel.buildColorStates(base);
        });
        var axisColor = colors.length > 1 ? '#999' : colors[0].line;

        var minMargin = 15;
        var horizontalMargin = Math.max(minMargin, use.yAxisLabelWidth);
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
            x: use.margin.left || horizontalMargin,
            x2: use.margin.right || horizontalMargin,
            y: use.margin.top || minMargin,
            y2: use.margin.bottom || minMargin + 13
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
          var drawBarMinWidth = use.barMinWidth + use.barMinSpacing;
          var drawBarMaxWidth = use.barMaxWidth + use.barMaxSpacing;
          var drawAllBarMinWidth = data.length * drawBarMinWidth;
          var drawAllBarMaxWidth = data.length * drawBarMaxWidth;
          var chartHeight = parseInt(use.height);

          if (use.rotate) {
            var gridMarginY = options.grid.borderWidth * 2 + options.grid.y + options.grid.y2;
            if (chartHeight < gridMarginY + drawAllBarMinWidth) {
              console.info('The chart is too short to hold so many bars, so that we increase the height to ' +
                (gridMarginY + drawAllBarMinWidth) + 'px for you.');
              options.height = (gridMarginY + drawAllBarMinWidth) + 'px';
            } else if (chartHeight > gridMarginY + drawAllBarMaxWidth) {
              options.height = (gridMarginY + drawAllBarMaxWidth) + 'px';
            }
          } else {
            var gridMarginX = options.grid.borderWidth * 2 + options.grid.x + options.grid.x2;
            var chartControlWidth = scope.getChartControlWidthFn();
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
              options.dataZoom.fillerColor = util.color.alpha(options.dataZoom.handleColor, 0.08);
              options.grid.y2 += scrollbarHeight + scrollbarGridMargin * 2;
            } else if (data.length) {
              if (visibleWidthForBars > drawAllBarMaxWidth) {
                // Too few bars to fill up the whole area, so increase the right/bottom margin
                options.grid.x2 += chartControlWidth - drawAllBarMaxWidth - gridMarginX;
              } else if (!angular.isDefined(use.margin.right)) {
                roundedVisibleWidthForBars = Math.floor(visibleWidthForBars / data.length) * data.length;
                options.grid.x2 += visibleWidthForBars - roundedVisibleWidthForBars;
              }
            }
          }
        }

        return options;
      }

      return {
        restrict: 'E',
        template: '<echart options="::initOptions" api="api" on-resize="handleResize()"></echart>',
        scope: {
          options: '=optionsBind',
          data: '=datasourceBind'
        },
        link: function(scope) {
          return $echarts.linkFn(scope, toEchartOptions);
        },
        controller: ['$scope', '$element', function($scope, $element) {
          $scope.getChartControlWidthFn = function() {
            return angular.element($element[0]).children()[0].offsetWidth;
          };
          $scope.initOptions = toEchartOptions($scope.options, $scope);
          $scope.handleResize = function() {
            $scope.options._dirty = new Date();
            return true;
          };
        }]
      };
    }])
;