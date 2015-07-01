/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts', [])
/**
 * Make DIV becoming an echart control.
 */
  .directive('echart', function() {
    'use strict';
    return {
      template: '<div></div>',
      replace: true,
      restrict: 'E',
      scope: {
        options: '=optionsBind',
        data: '=dataBind'
      },
      link: function(scope, elems) {
        var options = scope.options;
        var elem0 = elems[0];
        elem0.style.width = options.width;
        elem0.style.height = options.height;
        var chart = echarts.init(elem0);
        angular.element(window).on('resize', chart.resize);
        scope.$on('$destroy', function() {
          angular.element(window).off('resize', chart.resize);
          chart.dispose();
        });
        chart.setOption(options, /*do_not_merge=*/true);

        function ensureArray(obj) {
          return Array.isArray(obj) ? obj : [obj];
        }

        scope.$watch('data', function(data) {
          if (data) { // [{x: new Date(), y: [400, 300]}]
            var dataGrow = !options.xAxisDataNum ||
              chart.getOption().xAxis[0].data.length < options.xAxisDataNum;
            var array = [];
            angular.forEach(ensureArray(data), function(datum) {
              angular.forEach(ensureArray(datum.y), function(value, i) {
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
 * Customize chart's look and feel.
 */
  .factory('$echarts', function() {
    'use strict';
    return {
      tooltip: function(args) {
        var result = {
          trigger: args.trigger || 'axis',
          textStyle: {fontSize: 12},
          axisPointer: {type: 'none'},
          borderRadius: 2,
          formatter: args.formatter,
          position: function(p) {
            return [p[0], 22]; // fix the tooltip position
          }
        };
        if (args.color) {
          result.axisPointer = {
            type: 'line',
            lineStyle: {color: args.color, width: 3, type: 'dotted'}
          };
        }
        return result;
      },
      tooltipFirstSeriesFormatter: function(valueFormatter) {
        return function(params) {
          return valueFormatter(params[0].value);
        };
      },
      tooltipAllSeriesFormatter: function(valueFormatter) {
        return function(params) {
          return params[0].name +
            '<table>' +
            params.map(function(param) {
              var color = param.series.colors.line;
              return '<tr>' +
                '<td><div style="width:7px;height:7px;background-color:%s"></div></td>'.replace('%s', color) +
                '<td style="padding:0 12px 0 4px">' + param.seriesName + '</td>' +
                '<td>' + valueFormatter(param.value) + '</td>' +
                '</tr>';
            }).join('') + '</table>';
        };
      },
      makeDataSeries: function(args) {
        args.type = args.type || 'line';
        var options = {
          symbol: 'circle',
          smooth: true,
          itemStyle: {
            normal: {
              lineStyle: {color: args.colors.line, width: 3}
            },
            emphasis: {
              color: args.colors.line,
              lineStyle: {
                color: args.colors.line,
                width: args.showAllSymbol ? 4 : 3
              }
            }
          }
        }
        if (args.stack) {
          options.itemStyle.normal.areaStyle = {
            type: 'default', color: args.colors.area
          };
        }
        return angular.merge(args, options);
      },
      colorSet: function(i) {
        // todo: more color palette
        var palette = [
          {line: 'rgb(0,119,215)', area: '#ebf6ff'}, // blue
          {line: 'rgb(110,119,215)', area: '#eff0fb'}, // purple
          {line: 'rgb(41,189,181)', area: '#eefbfb'}, // green
          {line: 'rgb(212,102,138)', area: '#fbeff3'}, // dark red
          {line: 'rgb(255,127,80)', area: '#fff0eb'} // orange
        ];
        return palette[i % palette.length];
        // var hsl = d3.rgb(choice).hsl();
        // d3.hsl(hsl.h, hsl.s, 0.96)
      },
      rgba: function(rgb, opacity) {
        return rgb.replace('rgb(', 'rgba(').replace(')', ',' + opacity + ')');
      }
    };
  })
/**
 * Sparkline is an one data series line chart without axis labels.
 *
 * @example
 *   <sparkline-chart options-bind="sparkLineOptions" datasource-bind="sparkLineData"></sparkline-chart>
 *
 * @param options - the option object, which the following elements:
 * {
 *   height: string, // the css height of the chart
 *   width: string, // the css width of the chart
 *   maxDataNum: number, // the maximal number of data points in the chart (default: unlimited)
 *   tooltipFormatter: function // a function to specify tooltip
 *   seriesNames: [string] // name of data series in an array
 * }
 * @param data - array of data objects
 *  every data object is {x: time|string, y: number}
 */
  .directive('sparklineChart', function() {
    'use strict';
    return {
      template: '<echart options-bind="echartOptions" data-bind="data"></echart>',
      restrict: 'E',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = $scope.options;
        var data = $scope.data;
        var colors = $echarts.colorSet(0);
        $scope.echartOptions = {
          height: use.height, width: use.width,
          tooltip: $echarts.tooltip({
            formatter: use.tooltipFormatter ?
              use.tooltipFormatter :
              $echarts.tooltipFirstSeriesFormatter(
                use.valueFormatter || function(value) {
                  return value;
                }
              )
          }),
          dataZoom: {show: false},
          // 5px border on left and right to fix data point
          grid: {borderWidth: 0, x: 5, y: 5, x2: 5, y2: 0},
          xAxis: [{
            boundaryGap: false,
            axisLabel: false,
            splitLine: false,
            data: data.map(function(item) {
              return item.x;
            })
          }],
          yAxis: [{show: false}],
          xAxisDataNum: use.maxDataNum,
          series: [$echarts.makeDataSeries({
            colors: colors, stack: true /* stack=true means fill area */,
            data: data.map(function(item) {
              return item.y;
            })
          })]
        };
      }]
    };
  })
/**
 * Line chart control.
 *
 * @example
 *   <line-chart options-bind="lineChartOptions" datasource-bind="lineChartData"></line-chart>
 *
 * @param options - the option object, which the following elements:
 * {
 *   height: string, // the css height of the chart
 *   width: string, // the css width of the chart
 *   maxDataNum: number, // the maximal number of data points (of a series) in the chart (default: unlimited)
 *   tooltipFormatter: function // a function to specify tooltip,
 *   yAxisValuesNum: number // the number of values on y-axis (default: 3)
 *   stacked: boolean // should stack all data series (default: true)
 * }
 * @param data - array of data objects
 *  every data object is {x: time|string, y: [number]}
 */
  .directive('lineChart', function() {
    'use strict';
    return {
      template: '<echart options-bind="echartOptions" data-bind="data"></echart>',
      restrict: 'E',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = $scope.options;
        var data = $scope.data;
        var borderLineStyle = {lineStyle: {width: 1, color: '#ccc'}};
        var options = {
          height: use.height, width: use.width,
          tooltip: $echarts.tooltip({
            color: 'rgba(235,235,235,.75)',
            formatter: use.tooltipFormatter ?
              use.tooltipFormatter :
              $echarts.tooltipAllSeriesFormatter(
                use.valueFormatter || function(value) {
                  return value;
                }
              )
          }),
          dataZoom: {show: false},
          // 5px border on left and right to fix data point
          grid: {borderWidth: 0, y: 10, x2: 5, y2: 22},
          xAxis: [{
            boundaryGap: false,
            axisLine: borderLineStyle,
            axisTick: borderLineStyle,
            axisLabel: {show: true},
            splitLine: false,
            data: data.map(function(item) {
              return item.x;
            })
          }],
          yAxis: [{
            splitNumber: use.yAxisValuesNum || 3,
            splitLine: {show: false},
            axisLine: {show: false}
          }],
          xAxisDataNum: use.maxDataNum,
          series: [],
          // override the default color palette, otherwise the colors look messy.
          color: use.seriesNames.map(function(_, i) {
            return $echarts.colorSet(i).line;
          })
        };
        angular.forEach(use.seriesNames, function(name, i) {
          options.series.push(
            $echarts.makeDataSeries({
              colors: $echarts.colorSet(i), name: name,
              stack: use.hasOwnProperty('stacked') ? use.stacked : true,
              showAllSymbol: true,
              data: data.map(function(item) {
                return item.y[i];
              })
            })
          );
        });
        if (options.series.length > 1) {
          options.legend = {show: true, itemWidth: 8, data: []};
          angular.forEach(options.series, function(series) {
            options.legend.data.push(series.name);
          });
          options.grid.y = 30;
        }
        $scope.echartOptions = options;
      }]
    };
  })
;