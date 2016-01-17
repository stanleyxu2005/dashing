/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts.line', [
  'dashing.charts.adapter.echarts',
  'dashing.charts.look_and_feel'
])
/**
 * Line chart control.
 *
 * @param options-bind object
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
 *   yAxisLabelFormatter: function // optional to override the label formatter for y-axis
 *   yAxis2LabelFormatter: function // optional to override the label formatter for secondary y-axis
 *   yAxisScaled: boolean // show y-axis range as the [min, max] of data series instead of [0, max] (default: false)
 *   valueFormatter: function // function to override the representation of y-axis value
 *   xAxisTypeIsTime: boolean // use timeline as x-axis (currently disabled)
 *   seriesStacked: boolean // should stack all data series (default: true)
 *   seriesLineSmooth: boolean // draw line of series smooth (default: false)
 *   seriesYAxisIndex: array // indicates the y-axis index for every data series, value can be 0 or 1 (default: undefined)
 *   xAxisShowLabels: boolean // show x-axis labels (default: true)
 *   margin: {left: number, right: number, top: number, bottom: number} // override the margin values
 * }
 * @param datasource-bind - array
 *   every data object is {x: time|string, y: [number]}
 *
 * @example
 *   <line-chart
 *     options-bind="options"
 *     datasource-bind="dataArray">
 *   </line-chart>
 */
  .directive('lineChart', ['dashing.charts.look_and_feel', '$echarts',
    function(lookAndFeel, $echarts) {
      'use strict';

      function toEchartOptions(dsOptions) {
        var use = angular.merge({
          seriesStacked: true,
          seriesLineSmooth: false,
          showLegend: true,
          yAxisSplitNum: 3,
          yAxisShowSplitLine: true,
          yAxisLabelWidth: 60,
          yAxisLabelFormatter: $echarts.axisLabelFormatter(''),
          yAxisScaled: false,
          xAxisShowLabels: true,
          margin: {left: undefined, right: undefined, top: undefined, bottom: undefined}
        }, dsOptions);

        var data = use.data;
        $echarts.validateSeriesNames(use, data);

        if (!Array.isArray(use.colors) || !use.colors.length) {
          use.colors = lookAndFeel.lineChartColorRecommendation(use.seriesNames.length || 1);
        }
        var colors = use.colors.map(function(base) {
          return lookAndFeel.buildColorStates(base);
        });
        var axisColor = '#ccc';
        var borderLineStyle = {
          length: 4,
          lineStyle: {
            width: 1,
            color: axisColor
          }
        };

        var horizontalMargin = Math.max(15, use.yAxisLabelWidth);
        var options = {
          height: use.height,
          width: use.width,
          tooltip: angular.merge(
            $echarts.categoryTooltip(use.valueFormatter), {
              axisPointer: {
                type: 'line',
                lineStyle: {
                  width: 3,
                  color: 'rgb(235,235,235)',
                  type: 'dotted'
                }
              }
            }),
          grid: angular.merge({
            borderWidth: 0,
            x: use.margin.left || horizontalMargin,
            x2: use.margin.right || horizontalMargin,
            y: use.margin.top || 20,
            y2: use.margin.bottom || 25
          }, use.grid),
          xAxis: [{
            type: use.xAxisTypeIsTime ? 'time' : undefined,
            boundaryGap: use.xAxisBoundaryGap,
            axisLine: angular.merge({
              onZero: false
            }, borderLineStyle),
            axisTick: borderLineStyle,
            axisLabel: {show: true},
            splitLine: false
          }],
          yAxis: [{
            splitNumber: use.yAxisSplitNum,
            splitLine: {
              show: use.yAxisShowSplitLine,
              lineStyle: {
                color: axisColor,
                type: 'dotted'
              }
            },
            axisLine: false,
            axisLabel: {formatter: use.yAxisLabelFormatter},
            scale: use.yAxisScaled
          }],
          series: use.seriesNames.map(function(name, i) {
            return $echarts.makeDataSeries({
              name: name,
              colors: colors[i],
              stack: use.seriesStacked,
              smooth: use.seriesLineSmooth,
              showAllSymbol: use.showAllSymbol,
              yAxisIndex: Array.isArray(use.seriesYAxisIndex) ?
                use.seriesYAxisIndex[i] : 0
            });
          }),
          // override the default color colorPalette, otherwise the colors look messy.
          color: use.colors
        };

        if (_.contains(use.seriesYAxisIndex, 1)) {
          var yAxis2 = angular.copy(options.yAxis[0]);
          if (angular.isFunction(use.yAxis2LabelFormatter)) {
            yAxis2.axisLabel.formatter = use.yAxis2LabelFormatter;
          }
          options.yAxis.push(yAxis2);
        }

        $echarts.fillAxisData(options, data, use);

        if (!use.xAxisShowLabels) {
          options.xAxis[0].axisLabel = false;
          options.grid.y2 = options.grid.y;
        }

        if (use.xAxisTypeIsTime) {
          // todo: https://github.com/ecomfe/echarts/issues/1954
          $echarts.timelineChartFix(options, use);
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
            data: options.series.map(function(series) {
              return series.name;
            })
          };
          options.legend.y = 6;
          options.grid.y += 14;
          if (use.title) {
            options.legend.y += titleHeight;
            options.grid.y += legendHeight;
          }
        }

        if (addLegend || use.title) {
          options.grid.y += 12;
        }

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