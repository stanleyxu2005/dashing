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
        var xAxisIsTime = angular.isDate(datum.x);
        angular.forEach(ensureArray(datum.y), function(yValue, seriesIndex) {
          var params;
          if (xAxisIsTime) {
            params = [seriesIndex, [datum.x, yValue], /*isHead=*/false, dataGrow];
          } else {
            params = [seriesIndex, yValue, /*isHead=*/false, dataGrow];
            if (seriesIndex === 0) {
              params.push(datum.x);
            }
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
      controller: ['$scope', '$element', '$echarts', function($scope, $element, $echarts) {
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
        var initialized = angular.isDefined(chart.getOption().xAxis);

        function initializeDoneCheck() {
          if (initialized) {
            options = null;
          }
        }

        /** Method to add data points to chart */
        $scope.addDataPoints = function(data, newYAxisMaxValue) {
          if (!data || (Array.isArray(data) && !data.length)) {
            return;
          }
          try {
            // try to re-initialize when data is available
            if (!initialized) {
              $echarts.fillAxisData(options, Array.isArray(data) ? data : [data]);
              chart.setOption(options, /*overwrite=*/true);
              initialized = angular.isDefined(chart.getOption().xAxis);
              if (initialized) {
                chart.hideLoading();
              }
              initializeDoneCheck();
              return;
            }

            var currentOption = chart.getOption();
            var actualVisibleDataPoints = initialized ? currentOption.series[0].data.length : 0;
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
        };

        // If data points are more than the maximal visible data points, we put them into a queue and then
        // add them to the chart after the option is applied, otherwise all data points will be shown on
        // the chart.
        if (options.dataPointsQueue && options.dataPointsQueue.length) {
          if (!initialized) {
            console.warn({
              message: 'Failed to initialize the chart. All data points in queue will be dropped.',
              data: options.dataPointsQueue
            });
            return;
          }
          $scope.addDataPoints(options.dataPointsQueue);
          delete options.dataPointsQueue;
        }

        initializeDoneCheck();
      }]
    };
  })
/**
 * Customize chart's look and feel.
 */
  .factory('$echarts', ['$filter', function($filter) {
    'use strict';

    function buildTooltipSeriesTable(array) {

      function tooltipSeriesColorIndicatorHtml(color) {
        var border = zrender.tool.color.lift(color, -0.2);
        return '<div style="width: 10px; height: 10px; margin-top: 2px; border-radius: 2px; border: 1px solid ' + border + '; background-color: ' + color + '"></div>';
      }

      return '<table>' +
        array.map(function(obj) {
          if (!obj.name) {
            obj.name = obj.value;
            obj.value = '';
          }
          return '<tr>' +
            '<td>' + tooltipSeriesColorIndicatorHtml(obj.color) + '</td>' +
            '<td style="padding: 0 12px 0 4px">' + obj.name + '</td>' +
            '<td>' + obj.value + '</td>' +
            '</tr>';
        }).join('') + '</table>';
    }

    function defaultNameFormatter(name) {
      return angular.isDate(name) ?
        $filter('date')(name, 'yyyy-MM-dd HH:MM:ss') : name;
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
        if (args.guideLineColor) {
          result.axisPointer = {
            type: 'line',
            lineStyle: {
              color: args.guideLineColor,
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
      tooltipFirstSeriesFormatter: function(valueFormatter, nameFormatter) {
        return function(params) {
          var name = (nameFormatter || defaultNameFormatter)(params[0].name);
          return name +
            buildTooltipSeriesTable([{
              color: params[0].series.colors.line,
              name: params[0].series.name,
              value: valueFormatter ? valueFormatter(params[0].value) : params[0].value
            }]);
        };
      },
      /**
       * Tooltip content formatter for a multiple data series chart. Every
       * data series will have a colored legend in tooltip.
       */
      tooltipAllSeriesFormatter: function(valueFormatter, nameFormatter) {
        return function(params) {
          var name = (nameFormatter || defaultNameFormatter)(params[0].name);
          return name +
            buildTooltipSeriesTable(params.map(function(param) {
              return {
                color: param.series.colors.line,
                name: param.seriesName,
                value: valueFormatter ? valueFormatter(param.value) : param.value
              };
            }));
        };
      },
      /**
       * Tooltip for timeline chart with some limitation.
       * trigger can only be 'item'. Use 'axis' would draw line in wrong direction!
       */
      timelineTooltip: function(args) {
        args = args || {};
        return {
          // todo: https://github.com/ecomfe/echarts/issues/1954
          trigger: 'item',
          formatter: function(params) {
            var name = $filter('date')(params.value[0], 'yyyy-MM-dd HH:MM:ss');
            return name +
              buildTooltipSeriesTable([{
                color: params.series.colors.line,
                name: params.series.name,
                value: args.valueFormatter ? args.valueFormatter(params.value[1]) : params.value[1]
              }]);
          }
        };
      },
      /**
       * Formatter to change axis label to human readable values.
       */
      axisLabelFormatter: function(unit) {
        return function(value) {
          if (value !== 0) {
            var base = 1000;
            var s = ['', 'K', 'M', 'G', 'T', 'P'];
            var e = Math.floor(Math.log(value) / Math.log(base));
            value = value / Math.pow(base, e);
            // Label below can be 1000 and this label is 1500, which is expected to be "1.5 K" not "1 K".
            value = $filter('number')(value, Number(Math.floor(value) === 1));
            value += ' ' + s[e] + (unit || '');
          }
          return value;
        };
      },
      /**
       * Build the option object for data series.
       */
      makeDataSeries: function(args) {
        args.type = args.type || 'line';
        var lineWidth = args.stack ? 4 : 3;
        var options = {
          symbol: 'circle',
          smooth: args.smooth || true,
          itemStyle: {
            normal: {
              color: args.colors.line,
              lineStyle: {
                color: args.colors.line,
                width: lineWidth
              }
            },
            emphasis: {
              color: args.colors.hover,
              lineStyle: {
                color: args.colors.line,
                width: lineWidth
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
        if (!Array.isArray(data)) {
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
       * Reset axises in option and fill with initial data.
       */
      fillAxisData: function(options, data) {
        angular.forEach(options.series, function(series) {
          series.data = [];
        });

        if (options.xAxis[0].type === 'time') {
          // todo: https://github.com/ecomfe/echarts/issues/1954
          // otherwise no data will be shown.
          delete options.xAxis[0].boundaryGap;

          delete options.xAxis[0].data;
          angular.forEach(data, function(datum) {
            angular.forEach(options.series, function(series, seriesIndex) {
              series.data.push([
                datum.x,
                Array.isArray(datum.y) ? datum.y[seriesIndex] : datum.y]);
            });
          });
        } else {
          options.xAxis[0].data = [];
          angular.forEach(data, function(datum) {
            options.xAxis[0].data.push(datum.x);
            angular.forEach(options.series, function(series, seriesIndex) {
              series.data.push(
                Array.isArray(datum.y) ? datum.y[seriesIndex] : datum.y);
            });
          });
        }
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
  }])
;