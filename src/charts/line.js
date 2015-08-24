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
 *   maxDataNum: number // the maximal number of data points (of a series) in the chart (default: unlimited)
 *   tooltipFormatter: function // optional to override the tooltip formatter
 *   showLegend: boolean // show legend even when multiple data series on chart (default: true)
 *   yAxisSplitNum: number // the number of split ticks to be shown on y-axis (default: 3)
 *   yAxisShowSplitLine: boolean // show split lines on y-axis (default: true)
 *   yAxisLabelWidth: number // the pixels for the y-axis labels (default: 3)
 *   yAxisLabelFormatter: function // optional to override the label formatter
 *   xAxisType: ''|'time // empty sting or 'category' is string, 'time' need to feed x-axis data as date objects
 *   stacked: boolean // should stack all data series (default: true)
 *   seriesNames: [string] // name of data series in an array (the text will be shown in legend and tooltip as well)\
 *   scale: boolean // scale values on y-axis (default: false)
 *   data: // an array of initial data points (will fallback to $scope.data)
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

        // todo: watch can be expensive. we should find a simple way to expose the addDataPoint() method.
        scope.$watch('data', function(data) {
          if (data) {
            echartScope.addDataPoints(data);
          }
        });
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = angular.merge({
          stacked: true,
          showLegend: true,
          yAxisSplitNum: 3,
          yAxisShowSplitLine: true,
          yAxisLabelWidth: 60
        }, $scope.options);

        var data = $echarts.splitInitialData(use.data || $scope.data, use.maxDataNum);
        if (!use.seriesNames) {
          console.warn('seriesName not defined');
          use.seriesNames = data.older[0].y.map(function(_, i) {
            return 'Series ' + (i + 1);
          });
        }
        var colors = $echarts.colorPalette(use.seriesNames.length);
        var borderLineStyle = {
          lineStyle: {
            width: 1,
            color: '#ddd'
          }
        };

        // todo: https://github.com/ecomfe/echarts/issues/1954
        // for timeline x-axis, without showing all symbols no symbol will be shown.
        use.showAllSymbol = use.showAllSymbol || (use.xAxisType === 'time');
        use.stacked = use.stacked && (use.xAxisType !== 'time');

        var options = {
          height: use.height,
          width: use.width,
          tooltip: $echarts.tooltip({
            guideLineColor: 'rgb(235,235,235)',
            formatter: use.tooltipFormatter || $echarts
              .tooltipAllSeriesFormatter(use.valueFormatter)
          }),
          dataZoom: {show: false},
          // 5px border on left and right to fix data point
          grid: angular.merge({
            borderWidth: 0, x: use.yAxisLabelWidth, y: 20, x2: 5, y2: 23
          }, use.grid),
          xAxis: [{
            type: use.xAxisType,
            boundaryGap: false,
            axisLine: borderLineStyle,
            axisTick: borderLineStyle,
            axisLabel: {show: true},
            splitLine: false
          }],
          yAxis: [{
            splitNumber: use.yAxisSplitNum,
            splitLine: {show: use.yAxisShowSplitLine},
            axisLine: false,
            axisLabel: {formatter: use.yAxisLabelFormatter},
            scale: use.scale
          }],
          series: [],
          // override the default color colorPalette, otherwise the colors look messy.
          color: use.seriesNames.map(function(_, i) {
            return colors[i % colors.length].line;
          }),
          // own properties
          xAxisDataNum: use.maxDataNum,
          dataPointsQueue: data.newer
        };

        angular.forEach(use.seriesNames, function(name, i) {
          options.series.push(
            $echarts.makeDataSeries({
              name: name,
              colors: colors[i % colors.length],
              stack: use.stacked,
              showAllSymbol: use.showAllSymbol
            })
          );
        });

        $echarts.fillAxisData(options, data.older);
        if (use.xAxisType === 'time') {
          // todo: https://github.com/ecomfe/echarts/issues/1954
          options.tooltip = $echarts.timelineTooltip();
        }

        if (options.series.length === 1) {
          options.yAxis.boundaryGap = [0, 0.15];
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