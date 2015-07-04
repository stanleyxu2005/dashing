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
        chart.setOption(options, /*do_not_merge=*/true);
        angular.element(window).on('resize', chart.resize);
        scope.$on('$destroy', function() {
          angular.element(window).off('resize', chart.resize);
          chart.dispose();
        });

        scope.$watch('data', function(data) {
          if (data) {
            var visibleDots = Math.min(200 /* max visible dots per series */,
              Math.max(0, options.xAxisDataNum - chart.getOption().xAxis[0].data.length));
            chart.addData($echarts.makeDataArray(visibleDots, data));
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
                '<td><div style="width:7px;height:7px;background-color:%s"></div></td>'.replace('%s', color) +
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
        };
        if (args.stack) {
          options.itemStyle.normal.areaStyle = {
            type: 'default', color: args.colors.area
          };
        }
        return angular.merge(args, options);
      },
      /**
       * Build data array regarding specified number of maximal visible dots.
       *
       * Data is an array of object. Each object represents value(s) of a moment.
       * E.g.: The chart has two series. X-axis is date. Y-axis is value.
       *  [
       *   {x: "2015/7/1 00:00:00", y: [400, 300]},
       *   {x: "2015/7/1 00:00:10", y: [440, 320]}
       *  ]
       */
      makeDataArray: function(visibleDots, data) {
        function ensureArray(obj) {
          return Array.isArray(obj) ? obj : [obj];
        }

        var array = [];
        angular.forEach(ensureArray(data), function(datum) {
          var dataGrow = --visibleDots > 0;
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
       * Return an array of color objects regarding the num of data series.
       */
      colorPalette: function(size) {
        // todo: standalone color provider for all widgets
        // var hsl = d3.rgb(choice).hsl();
        // color.area = d3.hsl(hsl.h, hsl.s, 0.96);
        var colors = {
          blue: {line: 'rgb(0,119,215)', area: '#ebf6ff'},
          purple: {line: 'rgb(110,119,215)', area: '#eff0fb'},
          green: {line: 'rgb(41,189,181)', area: '#eefbfb'},
          darkRed: {line: 'rgb(212,102,138)', area: '#fbeff3'},
          orange: {line: 'rgb(255,127,80)', area: '#fff0eb'}
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
    };
  })
;