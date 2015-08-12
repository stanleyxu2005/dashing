/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts.echarts', [])
/**
 * Make DIV becoming an echart control.
 *
 * Recommend use `<echart options="::YourOptions"></echart>`, because the options will not accept new changes
 * anyway after the directive is stabilized.
 */
  .directive('echart', function() {
    'use strict';

    return {
      restrict: 'E',
      template: '<div></div>',
      replace: true /* tag will be replaced as div, otherwise echart cannot find a container to stay. */,
      scope: {
        options: '='
      },
      controller: ['$scope', '$element', '$echarts', function($scope, $element, $echarts) {
        var options = $scope.options;
        var elem0 = $element[0];
        elem0.style.width = options.width;
        elem0.style.height = options.height;
        var chart = echarts.init(elem0);

        angular.element(window).on('resize', chart.resize);
        $scope.$on('$destroy', function() {
          angular.element(window).off('resize', chart.resize);
          chart.dispose();
        });

        chart.setTheme($echarts.themeOverrides());
        chart.setOption(options, /*overwrite=*/true);

        /** Method to add data points to chart */
        $scope.addDataPoints = function(data, newYAxisMaxValue) {
          try {
            var actualVisibleDataPoints = chart.getOption().xAxis[0].data.length;
            var visibleDataPoints = Math.min(
              80 /* maximal visible data points per series */,
              Math.max(0, options.xAxisDataNum - actualVisibleDataPoints));
            var dataArray = $echarts.makeDataArray(visibleDataPoints, data);
            if (dataArray.length > 0) {
              if (newYAxisMaxValue !== undefined) {
                chart.setOption({
                  yAxis: [{max: newYAxisMaxValue}]
                }, /*overwrite=*/false);
              }
              chart.addData(dataArray);
            }
          } catch (ex) {
          }
        };

        if (options.initialDataRound1.length) {
          $scope.addDataPoints(options.initialDataRound1);
        }

        // Data points in `options` object are no longer used. We destroy them.
        delete options.initialDataRound1;
        delete options.xAxis[0].data;
        angular.forEach(options.series, function(_, i) {
          delete options.series[i].data;
        });
      }]
    };
  })
/**
 * Customize chart's look and feel.
 */
  .factory('$echarts', function() {
    'use strict';
    var self = {
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
          var color = params[0].series.colors.line;
          return params[0].name +
            '<table>' +
            '<tr>' +
            '<td>' + self.tooltipSeriesColorIndicatorHtml(color) + '</td>' +
            '<td style="padding-left: 4px">' + valueFormatter(params[0].value) + '</td>' +
            '</tr>' +
            '</table>';
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
                '<td>' + self.tooltipSeriesColorIndicatorHtml(color) + '</td>' +
                '<td style="padding: 0 12px 0 4px">' + param.seriesName + '</td>' +
                '<td>' + valueFormatter(param.value) + '</td>' +
                '</tr>';
            }).join('') + '</table>';
        };
      },
      tooltipSeriesColorIndicatorHtml: function(color) {
        return '<div style="width: 7px; height: 7px; background-color: ' + color + '"></div>';
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
          angular.forEach(ensureArray(datum.y), function(yValue, seriesIndex) {
            var params = [seriesIndex, yValue, /*isHead=*/false, dataGrow];
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
       * into two. The part `round0` are old data points, that will be shown when the chart
       * is created. The part `round1` will be added afterwards by `addDataPoints()`.
       */
      splitInitialData: function(data, visibleDataPoints) {
        if (!data || !Array.isArray(data)) {
          console.warn('Chart need at least a data point to initialize the axises.');
          data = [];
        }
        if (data.length <= visibleDataPoints) {
          return {round0: data, round1: []};
        }
        return {
          round0: data.slice(0, visibleDataPoints),
          round1: data.slice(visibleDataPoints)
        };
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
            fontFamily: 'lato,roboto,"helvetica neue","segoe ui",arial'
          },
          loadingText: 'Data Loading...',
          noDataText: 'No Graphic Data Found',
          addDataAnimation: false
        };
      }
    };
    return self;
  })
;