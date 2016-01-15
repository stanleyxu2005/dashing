/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts.adapter.echarts', [
  'dashing.util'
])
/**
 * Make DIV becoming an echart control.
 *
 * Recommend use `<echart options="::YourOptions"></echart>`, because the options will not accept new changes
 * anyway after the directive is stabilized.
 */
  .directive('echart', ['EchartWrapper', function(EchartWrapper) {
    'use strict';

    return {
      restrict: 'E',
      template: '<div></div>',
      replace: true /* tag will be replaced as div, otherwise echart cannot find a container to stay. */,
      scope: {
        options: '=',
        api: '=',
        onResize: '&'
      },
      controller: ['$scope', '$element', 'dashing.charts.echarts.defaults',
        function($scope, $element, defaults) {
          var options = $scope.options;
          var elem0 = $element[0];
          angular.forEach(['width', 'height'], function(prop) {
            if (options[prop]) {
              elem0.style[prop] = options[prop];
            }
          });
          var chart = echarts.init(elem0);
          chart.setTheme(defaults.lookAndFeel);

          function handleResizeEvent() {
            var handled = $scope.onResize();
            if (handled) {
              return $scope.$apply();
            }
            chart.resize();
          }

          angular.element(window).on('resize', handleResizeEvent);
          $scope.$on('$destroy', function() {
            angular.element(window).off('resize', handleResizeEvent);
            // Must after `chart.resize` is removed
            chart.dispose();
            chart = null;
          });

          $scope.api = new EchartWrapper(chart);
          $scope.api.rebuild(options);
        }]
    };
  }])
/**
 * Provide apis for operate Echart.
 */
  .service('EchartWrapper', ['dashing.util', function(util) {
    'use strict';

    var EchartWrapper = function(chart) {
      this.chart = chart;
      this.initOptions = null;
    };

    EchartWrapper.prototype = {

      rebuild: function(options) {
        this.chart.hideLoading();
        this.chart.clear();
        this.initOptions = null;

        this.chart.setOption(options, /*overwrite=*/true);
        this.chart.resize();

        if (!this.isGraphDataAvailable()) {
          this.initOptions = angular.copy(options);
          return;
        }

        // Initial data points will all be added to canvas, but we want to limit the number of
        // maximal visible data points. So we put the rest of them into a queue and add them to
        // chart after the option is applied.
        this.addDataPoints(options.dataPointsQueue, /*silent=*/true);
        this._applyGroupingFix(options.groupId);
      },

      _applyGroupingFix: function(groupId) {
        if (angular.isFunction(this.chart.group) && String(groupId).length) {
          this.chart.groupId = groupId;
          this.chart.group();
        }
      },

      addDataPoints: function(dataPoints, silent) {
        if (!Array.isArray(dataPoints) || !dataPoints.length) {
          if (!silent) {
            console.warn({msg: 'Invalid input data points', data: dataPoints});
          }
          return;
        }

        if (this.initOptions !== null) {
          this.rebuild(this.initOptions);
        }

        var currentChartOptions = this.chart.getOption();
        var dataArray = this._dataPointsToDataArray(dataPoints, currentChartOptions);
        if (dataArray.length > 0) {
          this.chart.addData(dataArray);
        }
      },

      _dataPointsToDataArray: function(dataPoints, options) {
        try {
          var actualVisibleDataPoints = options.series[0].data.length;
          var dataPointsGrowNum = Math.max(0,
            (options.visibleDataPointsNum || Number.MAX_VALUE) - actualVisibleDataPoints);
          var xAxisTypeIsTime = (options.xAxis[0].type === 'time') || // or rotated bar chart
            (options.xAxis[0].type === 'value' && options.yAxis[0].type === 'time');
          var seriesNum = options.series.length;

          return this._makeDataArray(dataPoints, seriesNum, dataPointsGrowNum, xAxisTypeIsTime);
        } catch (ex) {
        }
        return [];
      },

      _makeDataArray: function(data, seriesNum, dataPointsGrowNum, xAxisTypeIsTime) {
        var array = [];
        angular.forEach(util.array.ensureArray(data), function(datum) {
          var dataGrow = dataPointsGrowNum-- > 0;
          var yValues = util.array.ensureArray(datum.y).slice(0, seriesNum);
          if (xAxisTypeIsTime) {
            angular.forEach(yValues, function(yValue, seriesIndex) {
              var params = [seriesIndex, [datum.x, yValue], /*isHead=*/false, dataGrow];
              array.push(params);
            });
          } else {
            var lastSeriesIndex = yValues.length - 1;
            angular.forEach(yValues, function(yValue, seriesIndex) {
              var params = [seriesIndex, yValue, /*isHead=*/false, dataGrow];
              if (seriesIndex === lastSeriesIndex) {
                // x-axis label (for category type) must be added to the last series!
                params.push(datum.x);
              }
              array.push(params);
            });
          }
        });
        return array;
      },

      isGraphDataAvailable: function() {
        var currentOptions = this.chart.getOption();
        return angular.isObject(currentOptions.xAxis) &&
          currentOptions.xAxis.length &&
          currentOptions.xAxis[0].data;
      },

      updateOption: function(options) {
        this.chart.setOption(options, /*overwrite=*/false);
      }

    };

    return EchartWrapper;
  }])
/**
 * Constants of chart
 */
  .constant('dashing.charts.echarts.defaults', {
    // Echarts look and feel recommendation
    lookAndFeel: {
      markLine: {
        symbol: ['circle', 'circle']
      },
      title: {
        textStyle: {
          fontSize: 14,
          fontWeight: 400,
          color: '#000'
        }
      },
      legend: {
        textStyle: {
          color: '#111',
          fontWeight: 500
        },
        itemGap: 20
      },
      tooltip: {
        borderRadius: 2,
        padding: 0, // don't add padding here, otherwise empty tooltip will be a black square
        showDelay: 0,
        transitionDuration: 0.5,
        position: function(pos) {
          return [pos[0], 10];
        }
      },
      textStyle: {
        fontFamily: 'Roboto,"Helvetica Neue","Segoe UI","Hiragino Sans GB","Microsoft YaHei",Arial,Helvetica,SimSun,sans-serif',
        fontSize: 12
      },
      loadingText: 'Data Loading...',
      noDataText: 'No Graphic Data Available',
      addDataAnimation: false
    },
    // The number of visible data points can be shown on chart
    visibleDataPointsNum: 80
  }
)
/**
 * Customize chart's look and feel.
 */
  .factory('$echarts', ['$filter', 'dashing.util', function($filter, util) {
    'use strict';

    function buildTooltipSeriesTable(name, array, use) {

      function tooltipSeriesColorIndicatorHtml(color) {
        var border = zrender.tool.color.lift(color, -0.2);
        return '<div style="width: 10px; height: 10px; margin-top: 2px; border-radius: 2px; border: 1px solid ' + border + '; background-color: ' + color + '"></div>';
      }

      function mergeValuesAndSortDescent(array) {
        var grouped = {};
        angular.forEach(array, function(point) {
          grouped[point.name] = grouped[point.name] || [];
          grouped[point.name].push(point);
        });

        var result = [];
        angular.forEach(grouped, function(group) {
          var selected = group.reduce(function(p, c) {
            return Math.abs(Number(p.value)) > Math.abs(c.value) ? p : c;
          });
          selected.value = group.reduce(function(p, c) {
            return {value: p.value + c.value};
          }).value;
          result.push(selected);
        });

        return $filter('orderBy')(result, 'value', /*reversed=*/true);
      }

      var valueFormatter = use.valueFormatter || defaultValueFormatter;

      return '<div style="padding: 8px">' + [
          (use.nameFormatter || defaultNameFormatter)(name),
          '<table>' +
          mergeValuesAndSortDescent(array).map(function(point) {
            if (point.value === '-') {
              return '';
            } else {
              point.value = valueFormatter(point.value);
            }
            if (!point.name) {
              point.name = point.value;
              point.value = '';
            }
            return '<tr>' +
              '<td>' + tooltipSeriesColorIndicatorHtml(point.color) + '</td>' +
              '<td style="padding: 0 12px 0 4px">' + point.name + '</td>' +
              '<td style="text-align: right">' + point.value + '</td>' +
              '</tr>';
          }).join('') +
          '</table>'].join('') +
        '</div>';
    }

    function defaultNameFormatter(name) {
      if (angular.isDate(name)) {
        var now = new Date();
        return $filter('date')(name,
          (now.getYear() === name.getYear() &&
          now.getMonth() === name.getMonth() &&
          now.getDay() === name.getDay()) ?
            'HH:mm:ss' : 'yyyy-MM-dd HH:mm:ss');
      }
      return name;
    }

    function defaultValueFormatter(value) {
      return $filter('number')(value);
    }

    /**
     * Build the option object for tooltip
     */
    function tooltip(args) {
      return {
        trigger: args.trigger || 'axis',
        axisPointer: {type: 'none'},
        formatter: args.formatter
      };
    }

    /**
     * As we define the maximal visible data points, so we should split the data array
     * into two. The part `older` are old data points, that will be shown when the chart
     * is created. The part `newer` will be added afterwards by `addDataPoints()`.
     */
    function splitInitialData(data, visibleDataPoints) {
      if (!Array.isArray(data)) {
        data = [];
      }
      if (!visibleDataPoints || data.length <= visibleDataPoints) {
        return {older: data, newer: []};
      }
      return {
        older: data.slice(0, visibleDataPoints),
        newer: data.slice(visibleDataPoints)
      };
    }

    return {
      /**
       * Tooltip for category x-axis chart.
       */
      categoryTooltip: function(valueFormatter, nameFormatter) {
        return tooltip({
          trigger: 'axis',
          formatter: function(params) {
            params = util.array.ensureArray(params);
            var name = params[0].name;
            var array = params.map(function(param) {
              return {
                color: param.series.colors.line,
                name: param.seriesName,
                value: param.value
              };
            });

            // If no data at this moment, we should hint user instead of an empty tooltip.
            if (!name.length && !array.filter(function(point) {
                return point.value !== '-';
              }).length) {
              return '';
            }

            var args = {nameFormatter: nameFormatter, valueFormatter: valueFormatter};
            return buildTooltipSeriesTable(name, array, args);
          }
        });
      },
      /**
       * https://github.com/ecomfe/echarts/issues/1954
       */
      timelineChartFix: function(options, use) {
        console.warn('Echarts does not have a good experience for time series. ' +
          'We suggest to use category as x-axis type.');

        // Tooltip for timeline x-axis chart. Due to current limitation:
        // 1. trigger can only be 'item'. Use 'axis' would draw line in wrong direction!
        // 2. only the active data series will be shown in tooltip.
        options.tooltip = tooltip({
          trigger: 'item',
          formatter: function(params) {
            var array = [{
              color: params.series.colors.line,
              name: params.series.name,
              value: params.value[1]
            }];
            return buildTooltipSeriesTable(params.value[0], array, use);
          }
        });

        angular.forEach(options.xAxis, function(axis) {
          delete axis.boundaryGap;
        });
        angular.forEach(options.series, function(series) {
          series.showAllSymbol = true;
          series.stack = false;
        });
      },
      /**
       * Validate data series names. In case of problem, set default series names and warn user.
       */
      validateSeriesNames: function(use, data) {
        if (!use.seriesNames) {
          var first = util.array.ensureArray(data[0].y);
          if (first.length > 1) {
            console.warn({
              message: 'You should define `options.seriesNames`',
              options: use
            });
          }
          use.seriesNames = first.map(function(_, i) {
            return 'Series ' + (i + 1);
          });
        }
      },
      /**
       * Formatter to change axis label to human readable values.
       */
      axisLabelFormatter: function(unit, replaceLookup) {
        return function(value) {
          if (replaceLookup && replaceLookup.hasOwnProperty(value)) {
            return replaceLookup[value];
          }
          if (value != 0 && angular.isNumber(value)) {
            var hr = util.text.toHumanReadableNumber(value, 1000, 1);
            return hr.value + (unit ? ' ' + hr.modifier + unit : hr.modifier.toLowerCase());
          }
          return value;
        };
      },
      /**
       * Build the option object for data series.
       */
      makeDataSeries: function(args) {
        var options = {
          type: args.type || 'line',
          symbol: 'circle',
          symbolSize: 4,
          smooth: args.smooth,
          itemStyle: {
            normal: {
              color: args.colors.line,
              lineStyle: {
                width: args.stack ? 4 : 3
              },
              borderColor: 'transparent',
              borderWidth: 6
            },
            emphasis: {
              color: args.colors.hover,
              borderColor: zrender.tool.color.alpha(args.colors.line, 0.3)
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
       * Reset axises in option and fill with initial data (for line/bar/area charts)
       */
      fillAxisData: function(options, data, inputs) {
        data = data || [];

        if (angular.isObject(inputs)) {
          // #1: Set groupId when it is defined and valid
          if (angular.isString(inputs.groupId) && inputs.groupId.length) {
            options.groupId = inputs.groupId;
          }
          // #2: Set maximal visible data points
          if (inputs.visibleDataPointsNum > 0) {
            options.visibleDataPointsNum = inputs.visibleDataPointsNum;
            var placeholder = {
              x: '',
              y: options.series.map(function() {
                return {value: '-', tooltip: {}};
              })
            };
            while (data.length < inputs.visibleDataPointsNum) {
              data.unshift(placeholder);
            }
          }
        }

        var dataSplit = splitInitialData(data, options.visibleDataPointsNum);
        if (dataSplit.newer.length) {
          options.dataPointsQueue = dataSplit.newer;
        }

        angular.forEach(options.series, function(series) {
          series.data = [];
        });

        if (options.xAxis[0].type === 'time') {
          angular.forEach(dataSplit.older, function(datum) {
            angular.forEach(options.series, function(series, seriesIndex) {
              series.data.push([datum.x, Array.isArray(datum.y) ? datum.y[seriesIndex] : datum.y]);
            });
          });
        } else {
          var xLabels = [];
          angular.forEach(dataSplit.older, function(datum) {
            xLabels.push(datum.x);
            angular.forEach(options.series, function(series, seriesIndex) {
              series.data.push(Array.isArray(datum.y) ? datum.y[seriesIndex] : datum.y);
            });
          });
          options.xAxis[0].data = xLabels;
        }
      },
      /** A common link function to watch data and option changes for chart control. */
      linkFn: function(scope, toEchartOptionFn) {
        scope.$watch('data', function(data) {
          if (data) {
            var dataArray = Array.isArray(data) ? data : [data];
            scope.api.addDataPoints(dataArray);
          }
        });
        scope.$watch('options', function(newOptions, oldOptions) {
          if (!angular.equals(newOptions, oldOptions)) {
            scope.api.rebuild(toEchartOptionFn(newOptions, scope));
          }
        }, /*deep=*/true);
      }
    };
  }])
;