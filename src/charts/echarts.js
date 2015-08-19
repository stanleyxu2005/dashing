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

    /**
     * Build data array for echart control.
     *
     * E.g.: The chart has two series. X-axis is date. Y-axis is value.
     *  [
     *   {x: "2015/7/1 00:00:00", y: [400, 300]},
     *   {x: "2015/7/1 00:00:10", y: [440, 320]}
     *  ]
     */
    function makeDataArray(visibleDataPointsNum, data) {
      function ensureArray(obj) {
        return Array.isArray(obj) ? obj : [obj];
      }

      var array = [];
      angular.forEach(ensureArray(data), function(datum) {
        var dataGrow = visibleDataPointsNum-- > 0;
        angular.forEach(ensureArray(datum.y), function(yValue, seriesIndex) {
          var params = [seriesIndex, yValue, /*isHead=*/false, dataGrow];
          if (seriesIndex === 0) {
            params.push(datum.x);
          }
          array.push(params);
        });
      });
      return array;
    }

    /**
     * Return theme overrides
     */
    function makeDashingTheme() {
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

    return {
      restrict: 'E',
      template: '<div></div>',
      replace: true /* tag will be replaced as div, otherwise echart cannot find a container to stay. */,
      scope: {
        options: '='
      },
      controller: ['$scope', '$element', function($scope, $element) {
        var options = $scope.options;
        var elem0 = $element[0];
        angular.forEach(['width', 'height'], function(prop) {
          if (options[prop]) {
            elem0.style[prop] = options[prop];
          }
        });
        var chart = echarts.init(elem0);

        if (!options.ignoreContainerResizeEvent) {
          angular.element(window).on('resize', chart.resize);
          $scope.$on('$destroy', function() {
            angular.element(window).off('resize', chart.resize);
            chart.dispose();
            chart = null;
          });
        }

        chart.setTheme(makeDashingTheme());
        chart.setOption(options, /*overwrite=*/true);

        /** Method to add data points to chart */
        $scope.addDataPoints = function(data, newYAxisMaxValue) {
          try {
            var currentOption = chart.getOption();
            var actualVisibleDataPoints = currentOption.xAxis[0].data.length;
            var visibleDataPointsNum = Math.min(
              80 /* maximal visible data points per series */,
              Math.max(0, currentOption.xAxisDataNum - actualVisibleDataPoints));
            var dataArray = makeDataArray(visibleDataPointsNum, data);
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

        $scope.setOptions = function(options) {
          chart.setOption(options);
        }

        // If data points are more than the maximal visible data points, we put them into a queue and then
        // add them to the chart after the option is applied, otherwise all data points will be shown on
        // the chart.
        if (options.dataPointsQueue) {
          $scope.addDataPoints(options.dataPointsQueue);
        }

        // The object `options` is no longer used. We destroy it to free up memory.
        options = null;
      }]
    };
  })
/**
 * Customize chart's look and feel.
 */
  .factory('$echarts', function() {
    'use strict';

    function tooltipSeriesColorIndicatorHtml(color) {
      var border = zrender.tool.color.lift(color, -0.2);
      return '<div style="width: 10px; height: 10px; margin-top: 2px; border-radius: 2px; border: 1px solid ' + border + '; background-color: ' + color + '"></div>';
    }

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
          return params[0].name + '<br/>' + valueFormatter(params[0].value);
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
                '<td>' + tooltipSeriesColorIndicatorHtml(color) + '</td>' +
                '<td style="padding: 0 12px 0 4px">' + param.seriesName + '</td>' +
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
              color: args.colors.line,
              lineStyle: {
                color: args.colors.line,
                width: 3
              }
            },
            emphasis: {
              color: args.colors.hover,
              lineStyle: {
                color: args.colors.line,
                width: 5
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
       * As we define the maximal visible data points, so we should split the data array
       * into two. The part `older` are old data points, that will be shown when the chart
       * is created. The part `newer` will be added afterwards by `addDataPoints()`.
       */
      splitInitialData: function(data, visibleDataPoints) {
        if (!data || !Array.isArray(data)) {
          console.warn('Chart need at least 1 data point to initialize the axises.');
          data = [];
        }
        if (data.length <= visibleDataPoints) {
          return {older: data, newer: []};
        }
        return {
          older: data.slice(0, visibleDataPoints),
          newer: data.slice(visibleDataPoints)
        };
      },
      /**
       * Return an array of color objects regarding the num of data series.
       */
      colorPalette: function(size) {
        // todo: standalone color provider for all widgets
        function _suggestColorPalette(size) {
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

        return _suggestColorPalette(size).map(function(base) {
          return self.buildColorStates(base);
        });
      },
      /**
       * Build colors for state set.
       */
      buildColorStates: function(base) {
        return {
          line: base,
          area: zrender.tool.color.lift(base, -0.92),
          hover: zrender.tool.color.lift(base, 0.1)
        };
      }
    };

    return self;
  })
;