/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts', [
  'dashing.metrics'
])
/**
 * The angular directive of echarts control.
 */
  .directive('echart', function() {
    'use strict';
    return {
      restrict: 'A',
      scope: {
        options: '=',
        data: '='
      },
      link: function(scope, elems) {
        var options = scope.options;
        var elem0 = elems[0];
        elem0.style.width = options.width;
        elem0.style.height = options.height;
        var chart = echarts.init(elem0);
        chart.setOption(options, /*noMerge=*/true);

        scope.$watch('data', function(data) {
          // Expected to be an array of data series.
          // E.g.: [{x: new Date(), y: [400, 300]}, {x: new Date(), y: [405, 305}]
          if (data) {
            var dataGrow = !options.xAxisDataNum ||
              chart.getOption().xAxis[0].data.length < options.xAxisDataNum;
            if (!Array.isArray(data)) {
              data = [data];
            }
            var array = [];
            angular.forEach(data, function(datum) {
              if (!Array.isArray(datum.y)) {
                datum.y = [datum.y];
              }
              angular.forEach(datum.y, function(value, i) {
                var params = [i, value, /*isHead=*/false, dataGrow];
                if (i === 0) {
                  params.push(datum.x);
                }
                array.push(params);
              });
            });
            chart.addData(array);
          }
        });
      }
    };
  })
/**
 *
 */
  .factory('$echarts', function() {
    'use strict';
    return {
      /** */
      tooltip: function(args) {
        var result = {
          trigger: args.trigger || 'axis',
          textStyle: {fontSize: 12},
          axisPointer: {type: 'none'},
          borderRadius: 2,
          formatter: args.formatter
        };
        if (args.color) {
          result.axisPointer = {
            type: 'line',
            lineStyle: {color: args.color, width: 3, type: 'dotted'}
          };
        }
        return result;
      },
      /** */
      makeDataSeries: function(args) {
        args.type = args.type || 'line';
        return angular.merge(args, {
          smooth: true,
          itemStyle: {
            normal: {
              areaStyle: {type: 'default', color: args.colors.area},
              lineStyle: {color: args.colors.line, width: 3}
            },
            emphasis: {color: args.colors.line}
          }
        });
      },
      /** */
      colorSet: function(i) {
        switch (i % 2) {
          case 1:
            return {
              line: 'rgb(110,119,215)',
              grid: 'rgba(110,119,215,.2)',
              area: 'rgb(129,242,250)'
            };
        }
        return {
          line: 'rgb(0,119,215)',
          grid: 'rgba(0,119,215,.2)',
          area: 'rgb(229,242,250)'
        };
      }
    };
  })
/**
 * Sparkline is an one data series line chart without axis labels.
 *
 * @example
 *   <sparkline-chart options-bind="sparkLineOptions" data-bind="sparkLineData"></sparkline-chart>
 *
 * @param options - the option object, which the following elements:
 * {
 *   height: string, // the css height of the chart
 *   width: string, // the css width of the chart
 *   maxDataNum: number, // the maximal number of data points in the chart
 *   tooltipFormatter: function // a function to specify tooltip
 * }
 * @param data - array of object {x: label, y: value}
 */
  .directive('sparklineChart', function() {
    'use strict';
    return {
      template: '<div echart options="echartOptions" data="data"></div>',
      restrict: 'E',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = $scope.options;
        var colors = $echarts.colorSet(0);
        $scope.echartOptions = {
          height: use.height, width: use.width,
          tooltip: $echarts.tooltip({
            color: colors.grid, type: 'cross',
            formatter: use.tooltipFormatter ? function(params) {
              return use.tooltipFormatter(params[0]);
            } : undefined
          }),
          dataZoom: {show: false},
          grid: {borderWidth: 0, x: 5, y: 5, x2: 5, y2: 0},
          xAxis: [{
            boundaryGap: false,
            axisLabel: false,
            splitLine: false,
            data: $scope.data.map(function(item) {
              return item.x;
            })
          }],
          yAxis: [{show: false}],
          xAxisDataNum: use.maxDataNum,
          series: [$echarts.makeDataSeries({
            colors: colors, name: '1',
            data: $scope.data.map(function(item) {
              return item.y;
            })
          })]
        };
      }]
    };
  })
/**
 * Line chart control.
 * /
  .directive('lineChart', function() {
    'use strict';
    return {
      template: '<div echart options="echartOptions" data="data"></div>',
      restrict: 'E',
      scope: {
        options: '=',
        data: '='
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = $scope.options;
        var borderLineStyle = {lineStyle: {width: 1, color: '#ccc'}};
        var options = {
          tooltip: $echarts.tooltip({}),
          dataZoom: {show: false},
          grid: {borderWidth: 0, y: 10, x2: 30, y2: 20},
          xAxis: [{
            axisLabel: {show: true},
            axisLine: borderLineStyle,
            axisTick: borderLineStyle,
            splitLine: {show: false},
            data: use.xAxisData
          }],
          yAxis: [{
            splitNumber: 3,
            splitLine: {show: false},
            axisLine: {show: false}
          }],
          series: []
        };
        angular.forEach(use.series, function(series, i) {
          options.series.push(
            $echarts.makeDataSeries(
              angular.merge({colors: $echarts.colorSet(i)}, use.series[i])
            ));
        });
        if (options.series.length > 1) {
          options.legend = {show: true, data: []};
          angular.forEach(options.series, function(series) {
            options.legend.data.push(series.name);
          });
          options.grid.y = 30;
        }
        $scope.echartOptions = angular.merge(options, use.inject);
      }]
    };
  })*/
;