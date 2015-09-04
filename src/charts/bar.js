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
 *   colors: array|string // optional to override bar colors
 *   mergeSeriesInTooltip: boolean // sum values in tooltip and show as one value (default: false)
 *   showEveryValueLabel: boolean // show value label of every bar (rotated bar chart only)
 *   rotate: boolean // rotate the bar control (default: false)
 *   yAxisSplitNum: number // the number of split ticks to be shown on y-axis (default: 3)
 *   yAxisLabelWidth: number // the pixels for the y-axis labels (default: 3)
 *   yAxisLabelFormatter: function // optional to override the label formatter
 *   valueFormatter: function // optional to override the value formatter
 *   barWidth: number // when bar width is narrower than the value, data zoom control will be shown (default: 16)
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
          yAxisSplitNum: 3,
          yAxisLabelWidth: 60,
          yAxisLabelFormatter: $echarts.axisLabelFormatter(''),
          mergeSeriesInTooltip: false,
          yBoundaryGap: [0.2, 0.2],
          showEveryValueLabel: true,
          rotate: false
        }, $scope.options);

        use = angular.merge({
          barWidth: use.rotate ? 20 : 16,
          barSpacing: 4
        }, use);

        var data = use.data;
        if (!Array.isArray(data)) {
          console.warn({message: 'Initial data is expected to be an array', data: data});
          data = data ? [data] : [];
        }
        if (!use.seriesNames) {
          var first = Array.isArray(data[0].y) ? data[0].y : [data[0].y];
          if (first.length > 1) {
            console.warn('Fallback to default series names. ' +
              'You should set `barChartOptions.seriesNames`.');
          }
          use.seriesNames = first.map(function(_, i) {
            return 'Series ' + (i + 1);
          });
        }

        if (!Array.isArray(use.colors) || !use.colors.length) {
          use.colors = $echarts.barChartColorRecommendation(
            use.seriesNames.length || 1);
        }
        var colors = use.colors.map(function(base) {
          return $echarts.buildColorStates(base);
        });
        var options = {
          height: use.height,
          width: use.width,
          visibleDataPointsNum: -1, // Tell chart control only update existing data points' value.
          tooltip: angular.merge(
            $echarts.categoryTooltip(use.valueFormatter, undefined, use.mergeSeriesInTooltip), {
              axisPointer: {
                type: 'shadow',
                shadowStyle: {
                  color: 'rgba(225,225,225,0.3)'
                }
              }
            }),
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
            axisLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: '#666',
                type: 'dotted'
              }
            },
            axisTick: {show: false},
            splitLine: {show: false}
          }],
          yAxis: [{
            type: 'value',
            // todo: optional to hide y-axis
            splitNumber: use.yAxisSplitNum,
            splitLine: {
              show: true,
              lineStyle: {
                color: colors[0].axis,
                type: 'dotted'
              }
            },
            axisLine: {show: false},
            axisLabel: {formatter: use.yAxisLabelFormatter}
          }],
          series: use.seriesNames.map(function(name, i) {
            return $echarts.makeDataSeries({
              type: 'bar',
              name: name,
              stack: true,
              colors: colors[i % colors.length]
              // No need to set widths and gaps, the chart control will calculate it automatically.
            });
          }),
          // override the default color colorPalette, otherwise the colors look messy.
          color: use.colors
        };

        $echarts.fillAxisData(options, data);

        if (use.rotate) {
          var axisSwap = options.xAxis;
          options.xAxis = angular.copy(options.yAxis);
          options.xAxis[0].type = options.xAxis[0].type || 'value';
          options.yAxis = axisSwap;
          options.yAxis[0].type = options.yAxis[0].type || 'category';

          if (use.showEveryValueLabel) {
            if (use.yBoundaryGap) {
              options.xAxis[0].boundaryGap = use.yBoundaryGap;
            }

            var positions;
            switch (options.series.length) {
              case 1:
                positions = ['right'];
                break;
              case 2:
                positions = ['left', 'right'];
                break;
              default:
                positions = [null];
            }

            angular.forEach(options.series, function(series, i) {
              var position = positions[i % positions.length];
              if (position) {
                series.itemStyle.normal.label = {
                  show: true,
                  position: position
                };
                if (use.valueFormatter) {
                  series.itemStyle.normal.label.formatter = function(param) {
                    return use.valueFormatter(param.value);
                  };
                }
              }
            });
          }
        }

        // todo: currently the calculation can only happen at initialization stage, the chart will not response on a resizing event.
        var barVisibleWidth = use.barWidth + use.barSpacing;
        var allBarVisibleWidth = data.length * barVisibleWidth;
        if (use.rotate) {
          // todo: Rotated bar chart will not add a scrollbar, because I still cannot do the correct calculation.
          options.height = (options.grid.y + options.grid.y2 + allBarVisibleWidth) + 'px';
        } else {
          // Add a scrollbar to show too many bars
          var gridMargin = options.grid.borderWidth * 2 + options.grid.x + options.grid.x2;
          var chartMaxWidth = angular.element($element[0]).children()[0].offsetWidth;
          var currentWidthForBars = chartMaxWidth - gridMargin;

          if (allBarVisibleWidth > 0 && allBarVisibleWidth > currentWidthForBars) {
            var maxVisibleBarWidth = Math.floor(currentWidthForBars / barVisibleWidth) * barVisibleWidth;
            options.grid.x2 += currentWidthForBars - maxVisibleBarWidth;

            var scrollbarHeight = 20;
            var scrollbarGridMargin = 5;
            options.dataZoom = {
              show: true,
              end: maxVisibleBarWidth * 100 / allBarVisibleWidth,
              realtime: true,
              height: scrollbarHeight,
              y: parseInt(use.height) - scrollbarHeight - scrollbarGridMargin,
              handleColor: colors[0].line
            };
            options.dataZoom.fillerColor =
              zrender.tool.color.alpha(options.dataZoom.handleColor, 0.08);
            options.grid.y2 += scrollbarHeight + scrollbarGridMargin * 2;
          } else if (data.length) {
            // Too few bars to fill up the whole area, so increase the right/bottom margin
            options.grid.x2 += chartMaxWidth - allBarVisibleWidth - gridMargin;
          }
        }

        $scope.echartOptions = options;
      }]
    };
  }])
;