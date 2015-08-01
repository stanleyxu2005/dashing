/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts.echarts', [])
/**
 * Make DIV becoming an echart control.
 */
  .directive('echart', ['$echarts', function($echarts) {
    'use strict';
    return {
      template: '<div></div>',
      replace: true,
      restrict: 'E',
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
        chart.setTheme($echarts.themeOverrides());

        angular.element(window).on('resize', chart.resize);
        scope.$on('$destroy', function() {
          angular.element(window).off('resize', chart.resize);
          chart.dispose();
        });

        chart.setOption(options, /*overwrite=*/true);

        scope.$watch('data', function(data) {
          if (data) {
            try {
              var actualVisibleDataPoints = chart.getOption().xAxis[0].data.length;
              var visibleDataPoints = Math.min(
                80 /* maximal visible data points per series */,
                Math.max(0, options.xAxisDataNum - actualVisibleDataPoints));
              var dataArray = $echarts.makeDataArray(visibleDataPoints, data);
              if (dataArray.length > 0) {
                if (data.yAxisMax) {
                  chart.setOption({
                    yAxis: [{max: data.yAxisMax}]
                  }, /*overwrite=*/false);
                }
                chart.addData(dataArray);
              }
            } catch (ex) {
            }
          }
        });
      }
    };
  }])
/**
 * Customize chart's look and feel.
 */
  .factory('$echarts', function() {
    'use strict';
    return {
      /**
       * Build the option object for tooltip
       */
      tooltip: function(args) {
        var result = {
          trigger: args.trigger || 'axis',
          textStyle: {fontSize: 12},
          axisPointer: {type: 'none'},
          borderRadius: 2,
          showDelay: 0,
          formatter: args.formatter,
          position: args.position || function(p) {
            return [p[0], 22]; // fix the tooltip position
          }
        };
        if (args.color) {
          result.axisPointer = {
            type: 'line',
            lineStyle: {
              color: args.color,
              width: 3,
              type: 'dotted'
            }
          };
        }
        return result;
      },
      /**
       * Tooltip content formatter for a single data series chart.
       */
      tooltipFirstSeriesFormatter: function(valueFormatter) {
        return function(params) {
          // todo: show x-axis value?
          return valueFormatter(params[0].value);
        };
      },
      /**
       * Tooltip content formatter for a multiple data series chart. Every
       * data series will have a colored legend in tooltip.
       */
      tooltipAllSeriesFormatter: function(valueFormatter) {
        return function(params) {
          return params[0].name +
            '<table>' +
            params.map(function(param) {
              var color = param.series.colors.line;
              return '<tr>' +
                '<td><div style="width:7px;height:7px;background-color:' + color + '"></div></td>' +
                '<td style="padding:0 12px 0 4px">' + param.seriesName + '</td>' +
                '<td>' + valueFormatter(param.value) + '</td>' +
                '</tr>';
            }).join('') + '</table>';
        };
      },
      /**
       * Build the option object for data series.
       */
      makeDataSeries: function(args) {
        args.type = args.type || 'line';
        var options = {
          symbol: 'circle',
          smooth: args.smooth || true,
          itemStyle: {
            normal: {
              lineStyle: {
                color: args.colors.line,
                width: 3
              }
            },
            emphasis: {
              color: args.colors.line,
              lineStyle: {
                color: args.colors.line,
                width: 3
              }
            }
          }
        };
        if (args.stack) {
          options.itemStyle.normal.areaStyle = {
            type: 'default',
            color: args.colors.area
          };
        } else if (args.showAllSymbol) {
          // bugfix: seems the line is 1px thicker than args.stack version!
          options.itemStyle.normal.lineStyle.width -= 1;
        }
        return angular.merge(args, options);
      },
      /**
       * Build data array for echart control.
       *
       * E.g.: The chart has two series. X-axis is date. Y-axis is value.
       *  [
       *   {x: "2015/7/1 00:00:00", y: [400, 300]},
       *   {x: "2015/7/1 00:00:10", y: [440, 320]}
       *  ]
       */
      makeDataArray: function(visibleDataPoints, data) {
        function ensureArray(obj) {
          return Array.isArray(obj) ? obj : [obj];
        }

        var array = [];
        angular.forEach(ensureArray(data), function(datum) {
          var dataGrow = visibleDataPoints-- > 0;
          angular.forEach(ensureArray(datum.y), function(value, seriesIndex) {
            var params = [seriesIndex, value, /*isHead=*/false, dataGrow];
            if (seriesIndex === 0) {
              params.push(datum.x);
            }
            array.push(params);
          });
        });
        return array;
      },
      /**
       * As we define the maximal visible data points, so we should split the data array
       * into two. The head will be the initial data points. The rest of data points will
       * be append afterwards.
       */
      splitDataArray: function(data, visibleDataPoints) {
        if ([0, visibleDataPoints].indexOf(data.length) !== -1) {
          return {head: data, tail: []};
        }
        var result = {head: angular.copy(data), tail: []};
        if (result.head.length > visibleDataPoints) {
          result.tail = result.head.splice(visibleDataPoints);
        } else {
          var reference = result.head[0];
          for (var i = 0; i < visibleDataPoints - 1; i++) {
            result.head.unshift(reference);
          }
        }
        return result;
      },
      /**
       * Return an array of color objects regarding the num of data series.
       */
      colorPalette: function(size) {
        // todo: standalone color provider for all widgets
        function _suggestColor(size) {
          var colors = {
            blue: 'rgb(0,119,215)',
            purple: 'rgb(110,119,215)',
            green: 'rgb(41,189,181)',
            darkRed: 'rgb(212,102,138)',
            orange: 'rgb(255,127,80)'
          };
          switch (size) {
            case 1:
              return [colors.blue];
            case 2:
              return [colors.blue, colors.green];
            default:
              return Object.keys(colors).map(function(key) {
                return colors[key];
              });
          }
        }

        return _suggestColor(size).map(function(line) {
          var area = zrender.tool.color.lift(line, -0.92);
          return {line: line, area: area};
        });
      },
      /**
       * Return theme overrides
       */
      themeOverrides: function() {
        return {
          markLine: {
            symbol: ['circle', 'circle']
          },
          title: {
            textStyle: {
              fontSize: 14,
              fontWeight: '400',
              color: '#000'
            }
          },
          textStyle: {
            fontFamily: 'roboto,"helvetica neue","segoe ui",arial'
          },
          loadingText: 'Data Loading...',
          noDataText: 'No Graphic Data Found',
          addDataAnimation: false
        };
      }
    };
  })
;