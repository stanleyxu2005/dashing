/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts.echarts', [
  'dashing.util'
])
/**
 * Make DIV becoming an echart control.
 *
 * Recommend use `<echart options="::YourOptions"></echart>`, because the options will not accept new changes
 * anyway after the directive is stabilized.
 */
  .directive('echart', ['dashing.util', function(util) {
    'use strict';

    function makeDataArray(data, seriesNum, dataPointsGrowNum, xAxisTypeIsTime) {
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
    }

    return {
      restrict: 'E',
      template: '<div></div>',
      replace: true /* tag will be replaced as div, otherwise echart cannot find a container to stay. */,
      scope: {
        options: '='
      },
      controller: ['$scope', '$element', 'dsEchartsDefaults', '$echarts',
        function($scope, $element, defaults, $echarts) {
          var options = $scope.options;
          var elem0 = $element[0];
          angular.forEach(['width', 'height'], function(prop) {
            if (options[prop]) {
              elem0.style[prop] = options[prop];
            }
          });
          var chart = echarts.init(elem0);

          angular.element(window).on('resize', chart.resize);
          $scope.$on('$destroy', function() {
            angular.element(window).off('resize', chart.resize);
          });
          // Must after `chart.resize` is removed
          $scope.$on('$destroy', function() {
            chart.dispose();
            chart = null;
          });

          chart.setTheme(defaults.lookAndFeel);
          chart.setOption(options, /*overwrite=*/true);

          // Automatically group charts with same group id
          if (angular.isFunction(chart.group) && options.hasOwnProperty('groupId')) {
            chart.groupId = options.groupId;
            chart.group();
          }

          // If no data is provided, the chart is not initialized. And you can see a caution on the canvas.
          var initialized = angular.isDefined(chart.getOption().xAxis);

          function initializeDoneCheck() {
            if (initialized) {
              // If data points are more than the maximal visible data points, we put them into a queue and then
              // add them to the chart after the option is applied, otherwise all data points will be shown on
              // the chart.
              if (options.dataPointsQueue && options.dataPointsQueue.length) {
                addDataPoints(options.dataPointsQueue);
                delete options.dataPointsQueue;
              }
              delete options.data;
            }
          }

          initializeDoneCheck();

          /** Method to add data points to chart */
          function addDataPoints(data, newYAxisMaxValue) {
            if (!data || (Array.isArray(data) && !data.length)) {
              return;
            }
            try {
              // try to re-initialize when data is available
              if (!initialized) {
                $echarts.fillAxisData(options, util.array.ensureArray(data));
                chart.setOption(options, /*overwrite=*/true);
                initialized = angular.isDefined(chart.getOption().xAxis);
                initializeDoneCheck();
                if (initialized) {
                  chart.hideLoading();
                }
                return;
              }

              var currentOption = chart.getOption();
              var actualVisibleDataPoints = currentOption.series[0].data.length;
              var dataPointsGrowNum = Math.max(0,
                (currentOption.visibleDataPointsNum || defaults.visibleDataPointsNum) - actualVisibleDataPoints);
              var xAxisTypeIsTime = (currentOption.xAxis[0].type === 'time') || // or rotated bar chart
                (currentOption.xAxis[0].type === 'value' && currentOption.yAxis[0].type === 'time');
              var seriesNum = currentOption.series.length;
              var dataArray = makeDataArray(data, seriesNum, dataPointsGrowNum, xAxisTypeIsTime);
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
          }

          /** Export these functions. */
          $scope.addDataPoints = addDataPoints;
          $scope.getChartControl = function() {
            return chart;
          };
        }]
    };
  }])
/**
 * Constants of chart
 */
  .constant('dsEchartsDefaults', {
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
        transitionDuration: 0.5
      },
      textStyle: {
        fontFamily: 'lato,roboto,"helvetica neue","segoe ui",arial',
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
            return Math.abs(p.value) > Math.abs(c.value) ? p : c;
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
      axisLabelFormatter: function(unit) {
        return function(value) {
          if (angular.isNumber(value)) {
            value = Number(value); // echarts gives `value` decimal as string
            if (value !== 0) {
              var hr = util.text.toHumanReadableNumber(value, 1000, 1);
              value = hr.value + (unit ? ' ' + hr.modifier + unit : hr.modifier.toLowerCase());
            }
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

        delete options.xAxis[0].data;
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
      /**
       * Return a recommended color palette for line chart.
       */
      lineChartColorRecommendation: function(seriesNum) {
        var colors = util.color.palette;
        switch (seriesNum) {
          case 1:
            return [colors.blue];
          case 2:
            return [colors.blue, colors.blueishGreen];
          default:
            return util.array.repeatArray([
              colors.blue,
              colors.purple,
              colors.blueishGreen,
              colors.darkRed,
              colors.orange
            ], seriesNum);
        }
      },
      /**
       * Return a recommended color palette for bar chart.
       */
      barChartColorRecommendation: function(seriesNum) {
        var colors = util.color.palette;
        switch (seriesNum) {
          case 1:
            return [colors.orange];
          case 2:
            return [colors.blue, colors.darkBlue];
          default:
            return util.array.repeatArray([
              colors.lightGreen,
              colors.darkGray,
              colors.lightBlue,
              colors.blue,
              colors.darkBlue
            ], seriesNum);
        }
      },
      /**
       * Build colors for state set.
       */
      buildColorStates: function(base) {
        return {
          line: base,
          area: zrender.tool.color.lift(base, -0.92),
          hover: zrender.tool.color.lift(base, 0.15)
        };
      }
    };
  }])
;