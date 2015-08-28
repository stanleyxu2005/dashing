/*
 * dashing (assembled widgets)
 * @version v0.1.8
 * @link https://github.com/stanleyxu2005/dashing
 * @license Apache License 2.0, see accompanying LICENSE file
 */
(function(window, document, undefined) {
'use strict';
angular.module('dashing', [
  'dashing.charts.echarts',
  'dashing.charts.bar',
  'dashing.charts.line',
  'dashing.charts.metrics-sparkline',
  'dashing.charts.ring',
  'dashing.charts.sparkline',
  'dashing.contextmenu',
  'dashing.filters.duration',
  'dashing.forms.searchbox',
  'dashing.metrics',
  'dashing.progressbar',
  'dashing.property',
  'dashing.property.bytes',
  'dashing.remark',
  'dashing.state.indicator',
  'dashing.state.tag',
  'dashing.tables.property-table',
  'dashing.tables.property-table.builder',
  'dashing.tables.sortable-table',
  'dashing.tables.sortable-table.builder',
  'dashing.tabset',
  'dashing.util'
])
;
angular.module('dashing').run(['$templateCache', function($templateCache) {$templateCache.put('charts/metrics-sparkline-td.html','<metrics caption="{{caption}}" ng-attr-help="{{help}}" value="{{current}}" unit="{{unit}}" sub-text="{{subText}}" class="metrics-thicker-bottom"> </metrics> <sparkline-chart options-bind="options" datasource-bind="data"> </sparkline-chart>');
$templateCache.put('forms/searchbox.html','<div class="form-group has-feedback"> <input type="text" class="form-control" ng-model="ngModel" placeholder="{{placeholder}}"> <span class="glyphicon glyphicon-search form-control-feedback"></span> </div>');
$templateCache.put('metrics/metrics.html','<div class="metrics"> <div> <span class="metrics-caption" ng-bind="caption"></span> <remark ng-if="help" type="question" tooltip="{{help}}"></remark> </div> <h3 class="metrics-value"> <span ng-bind="value"></span> <small ng-bind="unit"></small> </h3> <small ng-if="subText" class="metrics-sub-text" ng-bind="subText"></small> </div>');
$templateCache.put('progressbar/progressbar.html','<div style="width: 100%">  <span class="small pull-left" ng-bind="current+\'/\'+max"></span> <span class="small pull-right" ng-bind="usage + \'%\'"></span> </div> <div style="width: 100%" class="progress progress-tiny"> <div ng-style="{\'width\': usage+\'%\'}" class="progress-bar {{usageClass}}"></div> </div>');
$templateCache.put('property/bytes.html','<span ng-bind="value|number:0"></span> <span ng-if="unit" ng-bind="unit"></span>');
$templateCache.put('property/property.html','<ng-switch on="renderer">  <a ng-switch-when="Link" ng-href="{{href}}" ng-bind="text"></a>  <button ng-switch-when="Button" ng-if="!hide" type="button" class="btn btn-default {{class}}" ng-bind="text" ng-click="click()" ng-disabled="disabled" ng-attr-bs-tooltip="tooltip"></button>  <tag ng-switch-when="Tag" text="{{text}}" ng-attr-href="{{href}}" ng-attr-condition="{{condition}}" ng-attr-tooltip="{{tooltip}}"></tag>  <indicator ng-switch-when="Indicator" ng-attr-shape="{{shape}}" ng-attr-condition="{{condition}}" ng-attr-tooltip="{{tooltip}}"></indicator>  <progressbar ng-switch-when="ProgressBar" current="{{current}}" max="{{max}}"></progressbar>  <bytes ng-switch-when="Bytes" raw="{{raw}}" ng-attr-unit="{{unit}}" ng-attr-readable="{{readable}}"></bytes>  <span ng-switch-when="Duration" ng-bind="value|duration"></span>  <span ng-switch-when="DateTime" ng-bind="value|date:\'yyyy-MM-dd HH:mm:ss\'"></span>  <span ng-switch-when="Number" ng-bind="value|number:0"></span>  <span ng-switch-default ng-bind="value"></span> </ng-switch>');
$templateCache.put('remark/remark.html','<span class="{{fontClass}} remark-icon" bs-tooltip="tooltip"></span>');
$templateCache.put('state/indicator.html','<ng-switch on="shape"> <div ng-switch-when="stripe" ng-style="{\'background-color\': colorStyle, \'cursor\': cursorStyle}" style="display: inline-block; height: 100%; width: 8px" bs-tooltip="tooltip" placement="right auto"></div> <span ng-switch-default ng-style="{\'color\': colorStyle, \'cursor\': cursorStyle}" class="glyphicon glyphicon-stop" bs-tooltip="tooltip"></span> </ng-switch>');
$templateCache.put('state/tag.html','<ng-switch on="!href"> <a ng-switch-when="false" ng-href="{{href}}" class="label label-lg {{labelColorClass}}" ng-bind="text" bs-tooltip="tooltip"></a> <span ng-switch-when="true" class="label label-lg {{labelColorClass}}" ng-style="{\'cursor\': cursorStyle}" ng-bind="text" bs-tooltip="tooltip"></span> </ng-switch>');
$templateCache.put('tables/property-table/property-table.html','<table class="table table-striped table-hover"> <caption ng-if="caption" ng-bind="caption"></caption> <tbody> <tr ng-repeat="prop in props track by $index"> <td ng-attr-ng-class="propNameClass"> <span ng-bind="prop.name"></span> <remark ng-if="prop.help" type="question" tooltip="{{prop.help}}"></remark> </td> <td ng-attr-ng-class="propValueClass"> <ng-switch on="prop.hasOwnProperty(\'values\')"> <property ng-switch-when="true" ng-repeat="value in prop.values track by $index" value-bind="value" renderer="{{::prop.renderer}}"></property> <property ng-switch-when="false" value-bind="prop.value" renderer="{{::prop.renderer}}"></property> </ng-switch> </td> </tr> </tbody> </table>');
$templateCache.put('tables/sortable-table/sortable-table-pagination.html','<div class="pull-left"> <st-summary></st-summary> </div> <div class="pull-right"> <div ng-if="pages.length >= 2" class="btn-group btn-group-xs">  <button type="button" class="btn btn-default" ng-class="{disabled:1==currentPage}" ng-click="selectPage(currentPage-1)"> &laquo;</button> <button type="button" class="btn btn-default" ng-repeat="page in pages track by $index" ng-class="{active:page==currentPage}" ng-click="selectPage(page)"> {{page}} </button> <button type="button" class="btn btn-default" ng-class="{disabled:numPages==currentPage}" ng-click="selectPage(currentPage+1)"> &raquo;</button>  </div> </div>');
$templateCache.put('tables/sortable-table/sortable-table.html','<table class="table table-striped table-hover" st-table="showing" st-safe-src="records"> <caption ng-if="caption" ng-bind="caption"></caption> <thead> <tr> <th ng-repeat="column in columns track by $index" class="{{::columnStyleClass[$index]}}" ng-attr-st-sort="{{::column.sortKey}}" ng-attr-st-sort-default="{{::column.defaultSort}}"> <span ng-bind="::column.name"></span> <remark ng-if="column.help" type="question" tooltip="{{::column.help}}"></remark> <span ng-if="column.unit" class="unit" ng-bind="column.unit"></span> </th> </tr> <tr ng-show="false"> <th colspan="{{columns.length}}">  <input type="hidden" st-search>  <div st-pagination st-items-by-page="pagination"></div> </th> </tr> </thead> <tbody> <tr ng-repeat="record in showing track by $index"> <td ng-repeat="column in columns track by $index" class="{{columnStyleClass[$index]}}"> <ng-switch on="isArray(column.key)"> <property ng-switch-when="true" ng-repeat="columnKeyChild in column.key track by $index" value-bind="record[columnKeyChild]" renderer="{{multipleRendererColumnsRenderers[$parent.$index][$index]}}"></property> <property ng-switch-when="false" value-bind="record[column.key]" renderer="{{column.renderer}}"></property> </ng-switch> </td> </tr> <tr ng-if="records !== null && !showing.length"> <td colspan="{{columns.length}}" class="text-center"> <i>No data found</i> </td> </tr> </tbody> <tfoot ng-if="records.length"> <tr> <td colspan="{{columns.length}}" st-pagination st-items-by-page="pagination" st-template="tables/sortable-table/sortable-table-pagination.html"> </td> </tr> </tfoot> </table>');
$templateCache.put('tabset/tabset.html','<ul class="nav nav-tabs nav-tabs-underlined"> <li ng-repeat="tab in tabs track by $index" ng-class="{active:tab.selected}"> <a href="" ng-click="selectTab($index)" ng-bind="tab.heading"></a> </li> </ul> <div class="tab-content" ng-transclude></div>');}]);
angular.module('dashing.charts.bar', [
  'dashing.charts.echarts'
])
  .directive('barChart', function() {
    return {
      restrict: 'E',
      template: '<echart options="::echartOptions"></echart>',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      link: function(scope) {
        var echartScope = scope.$$childHead;
        scope.$watch('data', function(data) {
          if (data) {
            echartScope.addDataPoints(data);
          }
        });
      },
      controller: ['$scope', '$element', '$echarts', function($scope, $element, $echarts) {
        var use = angular.merge({
          barMinWidth: 14,
          barMinSpacing: 4,
          color: $echarts.colorPalette(0)[0].line,
          yAxisSplitNum: 3,
          yAxisLabelWidth: 60
        }, $scope.options);
        var data = use.data;
        var colors = $echarts.buildColorStates(use.color);
        var options = {
          height: use.height,
          width: use.width,
          ignoreContainerResizeEvent: true,
          tooltip: $echarts.tooltip({
            formatter: use.tooltipFormatter || $echarts
              .tooltipFirstSeriesFormatter(use.valueFormatter)
          }),
          grid: angular.merge({
            borderWidth: 0, x: use.yAxisLabelWidth, y: 15, x2: 5, y2: 28
          }, use.grid),
          xAxis: [{
            axisLabel: {show: true},
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false},
            data: data.map(function(item) {
              return item.x;
            })
          }],
          yAxis: [{
            splitNumber: use.yAxisSplitNum,
            splitLine: {show: false},
            axisLine: {show: false},
            axisLabel: {formatter: use.yAxisLabelFormatter},
            scale: use.scale
          }],
          series: [$echarts.makeDataSeries({
            colors: colors,
            type: 'bar',
            data: data.map(function(item) {
              return Array.isArray(item.y) ? item.y[0] : item.y;
            })
          })],
          xAxisDataNum: use.maxDataNum
        };
        var gridWidth = options.grid.borderWidth * 2 + options.grid.x + options.grid.x2;
        var allBarVisibleWidth = data.length * (use.barMinWidth + use.barMinSpacing) - use.barMinSpacing;
        var chartMaxWidth = $element[0].offsetParent.offsetWidth;
        if (allBarVisibleWidth > 0 && allBarVisibleWidth + gridWidth > chartMaxWidth) {
          var scrollbarHeight = 20;
          var scrollbarPadding = 5;
          options.dataZoom = {
            show: true,
            barWidth: use.barMinWidth,
            barGap: use.barMinSpacing,
            barCategoryGap: use.barMinSpacing,
            end: Math.floor((chartMaxWidth - gridWidth) * 100 / allBarVisibleWidth),
            zoomLock: true,
            height: scrollbarHeight,
            y: parseInt(use.height) - scrollbarHeight - scrollbarPadding,
            handleColor: colors.line,
            dataBackgroundColor: colors.area,
            fillerColor: zrender.tool.color.alpha(colors.line, 0.2)
          };
          options.grid.y2 += scrollbarHeight + scrollbarPadding * 2;
        }
        $scope.echartOptions = options;
      }]
    };
  })
;
angular.module('dashing.charts.echarts', [])
  .directive('echart', function() {
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
            params = [seriesIndex, [datum.x, yValue], false, dataGrow];
          } else {
            params = [seriesIndex, yValue, false, dataGrow];
            if (seriesIndex === 0) {
              params.push(datum.x);
            }
          }
          array.push(params);
        });
      });
      return array;
    }
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
      replace: true ,
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
        chart.setOption(options, true);
        var initialized = angular.isDefined(chart.getOption().xAxis);
        function initializeDoneCheck() {
          if (initialized) {
            options = null;
          }
        }
                $scope.addDataPoints = function(data, newYAxisMaxValue) {
          if (!data || (Array.isArray(data) && !data.length)) {
            return;
          }
          try {
            if (!initialized) {
              $echarts.fillAxisData(options, Array.isArray(data) ? data : [data]);
              chart.setOption(options, true);
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
              80 ,
              Math.max(0, currentOption.xAxisDataNum - actualVisibleDataPoints));
            var dataArray = makeDataArray(visibleDataPointsNum, data);
            if (dataArray.length > 0) {
              if (newYAxisMaxValue !== undefined) {
                chart.setOption({
                  yAxis: [{max: newYAxisMaxValue}]
                }, false);
              }
              chart.addData(dataArray);
            }
          } catch (ex) {
          }
        };
        $scope.setOptions = function(options) {
          chart.setOption(options);
        };
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
  .factory('$echarts', ['$filter', function($filter) {
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
            '<td style="text-align: right">' + obj.value + '</td>' +
            '</tr>';
        }).join('') + '</table>';
    }
    function defaultNameFormatter(name) {
      return angular.isDate(name) ?
        $filter('date')(name, 'yyyy-MM-dd HH:mm:ss') : name;
    }
    function defaultValueFormatter(value) {
      return $filter('number')(value);
    }
    var self = {
            tooltip: function(args) {
        var result = {
          trigger: args.trigger || 'axis',
          textStyle: {fontSize: 12},
          axisPointer: {type: 'none'},
          borderRadius: 2,
          showDelay: 0,
          formatter: args.formatter,
          position: args.position || function(p) {
            return [p[0], 22];
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
            timelineTooltip: function(valueFormatter) {
        return {
          trigger: 'item',
          formatter: function(params) {
            var name = defaultNameFormatter(params.value[0]);
            return name +
              buildTooltipSeriesTable([{
                color: params.series.colors.line,
                name: params.series.name,
                value: valueFormatter ? valueFormatter(params.value[1]) : params.value[1]
              }]);
          }
        };
      },
            axisLabelFormatter: function(unit) {
        return function(value) {
          if (value !== 0) {
            var base = 1000;
            var s = ['', 'K', 'M', 'G', 'T', 'P'];
            var e = Math.floor(Math.log(value) / Math.log(base));
            value = value / Math.pow(base, e);
            value = defaultValueFormatter(value);
            value += ' ' + s[e] + (unit || '');
          }
          return value;
        };
      },
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
          options.itemStyle.normal.lineStyle.width -= 1;
        }
        return angular.merge(args, options);
      },
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
            fillAxisData: function(options, data) {
        angular.forEach(options.series, function(series) {
          series.data = [];
        });
        if (options.xAxis[0].type === 'time') {
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
            colorPalette: function(size) {
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
angular.module('dashing.charts.line', [
  'dashing.charts.echarts'
])
  .directive('lineChart', function() {
    return {
      restrict: 'E',
      template: '<echart options="::echartOptions" data="data"></echart>',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      link: function(scope) {
        var echartScope = scope.$$childHead;
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
          console.warn('Series names are NOT defined.');
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
          color: use.seriesNames.map(function(_, i) {
            return colors[i % colors.length].line;
          }),
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
          options.tooltip = $echarts.timelineTooltip(use.valueFormatter);
        }
        if (options.series.length === 1) {
          options.yAxis.boundaryGap = [0, 0.15];
        }
        var titleHeight = 20;
        var legendHeight = 16;
        if (use.title) {
          options.title = {
            text: use.title,
            x: 0,
            y: 3
          };
          options.grid.y += titleHeight;
        }
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
angular.module('dashing.charts.metrics-sparkline', [
  'dashing.charts.sparkline',
  'dashing.metrics'
])
  .directive('metricsSparklineChartTd', function() {
    return {
      restrict: 'E',
      templateUrl: 'charts/metrics-sparkline-td.html',
      scope: {
        caption: '@',
        help: '@',
        current: '@',
        unit: '@',
        subText: '@',
        options: '=optionsBind',
        data: '=datasourceBind'
      }
    };
  })
;
angular.module('dashing.charts.ring', [
  'dashing.charts.echarts'
])
  .directive('ringChart', function() {
    return {
      restrict: 'E',
      template: '<echart options="::echartOptions"></echart>',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      link: function(scope) {
        var echartScope = scope.$$childHead;
        scope.$watch('data', function(data) {
          echartScope.setOptions({
            series: [{
              data: [
                {value: data.available.value},
                {value: data.used.value}
              ]
            }]
          });
        });
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = angular.merge({
          color: 'rgb(35,183,229)',
          textPosition: 'inner'
        }, $scope.options);
        var data = use.data || $scope.data;
        if (!data) {
          console.warn('Need data to render the ring pie chart.');
        }
        var colors = $echarts.buildColorStates(use.color);
        var padding = 8;
        var outerRadius = (parseInt(use.height) - 30 - padding * 2) / 2;
        var itemStyleBase = {
          normal: {
            color: 'rgb(232,239,240)',
            label: {show: use.textPosition === 'inner', position: 'center'},
            labelLine: {show: false}
          }
        };
        var options = {
          height: use.height,
          width: use.width,
          grid: {borderWidth: 0},
          xAxis: [{show: false, data: [0]}],
          legend: {
            selectedMode: false,
            itemGap: 20,
            itemWidth: 13,
            y: 'bottom',
            data: [data.used.label, data.available.label].map(function(label) {
              return {name: label, textStyle: {fontWeight: 500}, icon: 'a'};
            })
          },
          series: [{
            type: 'pie',
            center: ['50%', outerRadius + padding],
            radius: [Math.floor(outerRadius * 0.74), outerRadius],
            data: [{
              name: data.available.label,
              value: data.available.value,
              itemStyle: itemStyleBase
            }, {
              name: data.used.label,
              value: data.used.value,
              itemStyle: angular.merge({}, itemStyleBase, {
                normal: {color: colors.line}
              })
            }]
          }]
        };
        switch (use.textPosition) {
          case 'inner':
            options.series[0].itemStyle = {
              normal: {
                label: {
                  formatter: function() {
                    return Math.round($scope.data.used.value * 100 /
                        ($scope.data.used.value + $scope.data.available.value)) + '%';
                  },
                  textStyle: {
                    color: '#111',
                    fontSize: 28,
                    fontWeight: 500,
                    baseline: 'middle'
                  }
                }
              }
            };
            break;
          case 'right':
            if (use.title) {
              options.series[0].center[0] = outerRadius + padding;
              options.legend.x = padding;
              options.title = {
                text: $scope.data.used.value + ($scope.data.used.unit || ''),
                subtext: use.title,
                itemGap: 11,
                x: (outerRadius + padding) * 2 + padding,
                y: outerRadius + padding - 40,
                textStyle: {
                  fontSize: 40,
                  fontWeight: 500
                },
                subtextStyle: {
                  fontSize: 14
                }
              };
            }
            break;
        }
        $scope.echartOptions = options;
      }]
    };
  })
;
angular.module('dashing.charts.sparkline', [
  'dashing.charts.echarts'
])
  .directive('sparklineChart', function() {
    return {
      restrict: 'E',
      template: '<echart options="::echartOptions"></echart>',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      link: function(scope) {
        var echartScope = scope.$$childHead;
        scope.$watch('data', function(data) {
          if (data) {
            echartScope.addDataPoints(data);
          }
        });
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = $scope.options;
        var data = $echarts.splitInitialData(use.data || $scope.data, use.maxDataNum);
        var colors = $echarts.colorPalette(1)[0];
        use.showAllSymbol = use.showAllSymbol || (use.xAxisType === 'time');
        use.stacked = use.stacked && (use.xAxisType !== 'time');
        var options = {
          height: use.height,
          width: use.width,
          tooltip: $echarts.tooltip({
            formatter: use.tooltipFormatter || $echarts
              .tooltipFirstSeriesFormatter(use.valueFormatter)
          }),
          dataZoom: {show: false},
          grid: angular.merge({
            borderWidth: 1, x: 5, y: 5, x2: 5,
            y2: 1           }, use.grid),
          xAxis: [{
            type: use.xAxisType,
            boundaryGap: false,
            axisLabel: false,
            splitLine: false
          }],
          yAxis: [{
            boundaryGap: [0, 0.15],
            show: false,
            scale: use.scale
          }],
          series: [$echarts.makeDataSeries({
            colors: colors,
            stack: true           })],
          xAxisDataNum: use.maxDataNum,
          dataPointsQueue: data.newer
        };
        $echarts.fillAxisData(options, data.older);
        if (use.xAxisType === 'time') {
          options.tooltip = $echarts.timelineTooltip(use.valueFormatter);
          options.series[0].showAllSymbol = true;
          options.series[0].stack = false;
        }
        $scope.echartOptions = options;
      }]
    };
  })
;
angular.module('dashing.contextmenu', [
  'mgcrea.ngStrap.dropdown'
])
  .factory('$contextmenu', function() {
    return {
      popup: function(elem, position) {
        var elem0 = angular.element(elem);
        elem0.css({left: position.x + 'px', top: position.y + 'px'});
        elem0.triggerHandler('click');
      }
    };
  })
;
angular.module('dashing.filters.duration', [])
  .filter('duration', function() {
    return function(millis, compact) {
      var x = parseInt(millis, 10);
      if (isNaN(x)) {
        return millis;
      }
      var units = [
        {label: ' ms', mod: 1000},
        {label: compact ? 's' : ' secs', mod: 60},
        {label: compact ? 'm' : ' mins', mod: 60},
        {label: compact ? 'h' : ' hours', mod: 24},
        {label: compact ? 'd' : ' days', mod: 7},
        {label: compact ? 'w' : ' weeks', mod: 52}
      ];
      var duration = [];
      for (var i = 0; i < units.length; i++) {
        var unit = units[i];
        var t = x % unit.mod;
        if (t !== 0) {
          duration.unshift({label: unit.label, value: t});
        }
        x = (x - t) / unit.mod;
      }
      duration = duration.slice(0, 2);
      if (duration.length > 1 && duration[1].label === ' ms') {
        duration = [duration[0]];
      }
      return duration.map(function(unit) {
        return unit.value + unit.label;
      }).join(compact ? ' ' : ' and ');
    };
  })
;
angular.module('dashing.forms.searchbox', [
])
  .directive('searchbox', function() {
    return {
      restrict: 'E',
      templateUrl: 'forms/searchbox.html',
      scope: {
        placeholder: '@',
        ngModel: '='
      }
    };
  })
;
angular.module('dashing.metrics', [])
  .directive('metrics', function() {
    return {
      restrict: 'E',
      templateUrl: 'metrics/metrics.html',
      scope: {
        caption: '@',
        help: '@',
        value: '@',
        unit: '@',
        subText: '@'
      }
    };
  })
;
angular.module('dashing.progressbar', [])
  .directive('progressbar', function() {
    return {
      restrict: 'E',
      templateUrl: 'progressbar/progressbar.html',
      scope: {
        current: '@',
        max: '@',
        colorMapperFn: '='
      },
      link: function(scope, elem, attrs) {
        attrs.$observe('current', function(current) {
          updateUsageAndClass(Number(current), Number(attrs.max));
        });
        attrs.$observe('max', function(max) {
          updateUsageAndClass(Number(attrs.current), Number(max));
        });
        function updateUsageAndClass(current, max) {
          scope.usage = max > 0 ? Math.round(current * 100 / max) : -1;
          scope.usageClass = (scope.colorMapperFn ?
            scope.colorMapperFn : defaultColorMapperFn)(scope.usage);
        }
        function defaultColorMapperFn(usage) {
          return 'progress-bar-' +
            (usage < 50 ? 'info' : (usage < 75 ? 'warning' : 'danger'));
        }
      }
    };
  })
;
angular.module('dashing.property.bytes', [])
  .directive('bytes', function() {
    return {
      restrict: 'E',
      templateUrl: 'property/bytes.html',
      scope: {
        raw: '@'
      },
      link: function(scope, elem, attrs) {
        attrs.$observe('raw', function(raw) {
          if (['true', '1'].indexOf(attrs['readable']) !== -1) {
            var hr = toHumanReadable(Number(raw));
            scope.value = hr.value;
            scope.unit = hr.modifier + attrs.unit;
          } else {
            scope.unit = attrs.unit;
          }
        });
        function toHumanReadable(value) {
          var modifier = '';
          if (value !== 0) {
            var positiveValue = Math.abs(value);
            var s = ['', 'K', 'M', 'G', 'T', 'P'];
            var e = Math.floor(Math.log(positiveValue) / Math.log(1024));
            value = Math.floor(positiveValue / Math.pow(1024, e)) * (positiveValue === value ? 1 : -1);
            modifier = s[e];
          }
          return {value: value, modifier: modifier};
        }
      }
    };
  })
;
angular.module('dashing.property', [
  'mgcrea.ngStrap.tooltip'
])
  .directive('property', function() {
    return {
      restrict: 'E',
      templateUrl: 'property/property.html',
      replace: false,
      scope: {
        value: '=valueBind',
        renderer: '@'
      },
      controller: ['$scope', function($scope) {
        $scope.$watch('value', function(value) {
          if (value) {
            switch ($scope.renderer) {
              case 'Link':
                if (!value.href) {
                  $scope.href = value.text;
                }
                break;
              case 'Button':
                if (value.href && !value.click) {
                  $scope.click = function() {
                    location.href = value.href;
                  };
                }
                break;
              case 'Bytes':
                if (!value.hasOwnProperty('raw')) {
                  $scope.raw = value;
                  return;
                }
                break;
            }
            if (angular.isObject(value)) {
              if (value.hasOwnProperty('value')) {
                console.warn({message: 'Ignore `value.value`, because it is a reversed field.', object: value});
                delete value.value;
              }
              angular.merge($scope, value);
            }
          }
        });
      }]
    };
  })
    .constant('PROPERTY_RENDERER', {
    BUTTON: 'Button',
    BYTES: 'Bytes',
    DATETIME: 'DateTime',
    DURATION: 'Duration',
    INDICATOR: 'Indicator',
    LINK: 'Link',
    NUMBER: 'Number',
    PROGRESS_BAR: 'ProgressBar',
    TAG: 'Tag',
    TEXT: undefined   })
;
angular.module('dashing.remark', [
  'mgcrea.ngStrap.tooltip'
])
  .directive('remark', function() {
    return {
      restrict: 'E',
      templateUrl: 'remark/remark.html',
      scope: {
        tooltip: '@'
      },
      link: function(scope, elem, attrs) {
        switch (attrs.type) {
          case 'info':
            scope.fontClass = 'glyphicon glyphicon-info-sign';
            break;
          case 'warning':
            scope.fontClass = 'glyphicon glyphicon-exclamation-sign';
            break;
          default:
            scope.fontClass = 'glyphicon glyphicon-question-sign';
            break;
        }
      }
    };
  })
;
angular.module('dashing.state.indicator', [
  'dashing.util',
  'mgcrea.ngStrap.tooltip'
])
  .directive('indicator', ['$util', function($util) {
    return {
      restrict: 'E',
      templateUrl: 'state/indicator.html',
      scope: {
        tooltip: '@',
        shape: '@'
      },
      link: function(scope, elem, attrs) {
        if (!attrs.condition) {
          attrs.condition = '';
        }
                attrs.$observe('condition', function(condition) {
          scope.colorStyle = $util.conditionToColor(condition);
        });
                attrs.$observe('tooltip', function(tooltip) {
          scope.cursorStyle = tooltip ? 'pointer' : 'default';
        });
      }
    };
  }])
;
angular.module('dashing.state.tag', [
  'dashing.util',
  'mgcrea.ngStrap.tooltip'
])
  .directive('tag', ['$util', function($util) {
    return {
      restrict: 'E',
      templateUrl: 'state/tag.html',
      scope: {
        href: '@',
        text: '@',
        tooltip: '@'
      },
      link: function(scope, elem, attrs) {
        if (!attrs.condition) {
          attrs.condition = '';
        }
                attrs.$observe('condition', function(condition) {
          scope.labelColorClass = $util.conditionToBootstrapLabelClass(condition);
        });
                attrs.$observe('tooltip', function(tooltip) {
          if (!scope.href) {
            scope.cursorStyle = tooltip ? 'pointer' : 'default';
          }
        });
      }
    };
  }])
;
angular.module('dashing.tables.property-table.builder', [])
  .factory('$propertyTableBuilder', ['PROPERTY_RENDERER',
    function(PROPERTY_RENDERER) {
      var PB = function(renderer, title) {
        this.props = renderer ? {renderer: renderer} : {};
        if (title) {
          this.title(title);
        }
      };
      PB.prototype.title = function(title) {
        this.props.name = title;
        return this;
      };
      PB.prototype.help = function(help) {
        this.props.help = help;
        return this;
      };
      PB.prototype.value = function(value) {
        this.props.value = value;
        return this;
      };
      PB.prototype.values = function(values) {
        if (!Array.isArray(values)) {
          console.warn('values must be an array');
          values = [values];
        }
        this.props.values = values;
        return this;
      };
      PB.prototype.done = function() {
        return this.props;
      };
      return {
        button: function(title) {
          return new PB(PROPERTY_RENDERER.BUTTON, title);
        },
        bytes: function(title) {
          return new PB(PROPERTY_RENDERER.BYTES, title);
        },
        datetime: function(title) {
          return new PB(PROPERTY_RENDERER.DATETIME, title);
        },
        duration: function(title) {
          return new PB(PROPERTY_RENDERER.DURATION, title);
        },
        indicator: function(title) {
          return new PB(PROPERTY_RENDERER.INDICATOR, title);
        },
        link: function(title) {
          return new PB(PROPERTY_RENDERER.LINK, title);
        },
        number: function(title) {
          return new PB(PROPERTY_RENDERER.NUMBER, title);
        },
        progressbar: function(title) {
          return new PB(PROPERTY_RENDERER.PROGRESS_BAR, title);
        },
        tag: function(title) {
          return new PB(PROPERTY_RENDERER.TAG, title);
        },
        text: function(title) {
          return new PB(PROPERTY_RENDERER.TEXT, title);
        },
                $update: function(table, values) {
          angular.forEach(values, function(value, key) {
            table[key][Array.isArray(value) ? 'values' : 'value'] = value;
          });
        }
      };
    }])
;
angular.module('dashing.tables.property-table', [])
  .directive('propertyTable', function() {
    return {
      restrict: 'E',
      templateUrl: 'tables/property-table/property-table.html',
      scope: {
        caption: '@',
        props: '=propsBind',
        propNameClass: '@',
        propValueClass: '@'
      }
    };
  })
;
angular.module('dashing.tables.sortable-table.builder', [
  'dashing.property'
])
  .factory('$sortableTableBuilder', ['PROPERTY_RENDERER',
    function(PROPERTY_RENDERER) {
      var CB = function(renderer, title) {
        this.props = renderer ? {renderer: renderer} : {};
        if (title) {
          this.title(title);
        }
      };
      CB.prototype.title = function(title) {
        this.props.name = title;
        return this;
      };
      CB.prototype.key = function(key) {
        this.props.key = key;
        return this;
      };
      CB.prototype.canSort = function(overrideSortKey) {
        if (!overrideSortKey && !this.props.key) {
          console.warn('Specify a sort key or define column key first!');
          return;
        }
        this.props.sortKey = overrideSortKey || this.props.key;
        if (this.props.sortKey === this.props.key) {
          switch (this.props.renderer) {
            case PROPERTY_RENDERER.LINK:
              this.props.sortKey += '.text';
              break;
            case PROPERTY_RENDERER.INDICATOR:
            case PROPERTY_RENDERER.TAG:
              this.props.sortKey += '.condition';
              break;
            case PROPERTY_RENDERER.PROGRESS_BAR:
              this.props.sortKey += '.usage';
              break;
            case PROPERTY_RENDERER.BYTES:
              this.props.sortKey += '.raw';
              break;
            case PROPERTY_RENDERER.BUTTON:
              console.warn('"%s" column is not sortable.');
              return;
            default:
          }
        }
        return this;
      };
      CB.prototype.sortDefault = function(descent) {
        if (!this.props.sortKey) {
          console.warn('Specify a sort key or define column key first!');
          return;
        }
        this.props.defaultSort = descent ? 'reverse' : true;
        return this;
      };
      CB.prototype.sortDefaultDescent = function() {
        return this.sortDefault(true);
      };
      CB.prototype.styleClass = function(styleClass) {
        this.props.styleClass = styleClass;
        return this;
      };
      CB.prototype.sortBy = function(sortKey) {
        this.props.sortKey = sortKey;
        return this;
      };
      CB.prototype.unit = function(unit) {
        this.props.unit = unit;
        return this;
      };
      CB.prototype.help = function(help) {
        this.props.help = help;
        return this;
      };
      CB.prototype.done = function() {
        return this.props;
      };
      return {
        button: function(title) {
          return new CB(PROPERTY_RENDERER.BUTTON, title);
        },
        bytes: function(title) {
          return new CB(PROPERTY_RENDERER.BYTES, title);
        },
        datetime: function(title) {
          return new CB(PROPERTY_RENDERER.DATETIME, title);
        },
        duration: function(title) {
          return new CB(PROPERTY_RENDERER.DURATION, title);
        },
        indicator: function(title) {
          return new CB(PROPERTY_RENDERER.INDICATOR, title);
        },
        link: function(title) {
          return new CB(PROPERTY_RENDERER.LINK, title);
        },
        multiple: function(title, renderers) {
          return new CB(renderers, title);
        },
        number: function(title) {
          return new CB(PROPERTY_RENDERER.NUMBER, title);
        },
        progressbar: function(title) {
          return new CB(PROPERTY_RENDERER.PROGRESS_BAR, title);
        },
        tag: function(title) {
          return new CB(PROPERTY_RENDERER.TAG, title);
        },
        text: function(title) {
          return new CB(PROPERTY_RENDERER.TEXT, title);
        },
                $check: function(cols, model) {
          angular.forEach(cols, function(col) {
            var keys = Array.isArray(col.key) ? col.key : [col.key];
            angular.forEach(keys, function(key) {
              if (!model.hasOwnProperty(key)) {
                console.warn('Model does not have a property matches column key `' + col + '`.');
              }
            });
          });
        }
      };
    }])
;
angular.module('dashing.tables.sortable-table', [
  'smart-table'
])
  .directive('sortableTable', function() {
    return {
      restrict: 'E',
      templateUrl: 'tables/sortable-table/sortable-table.html',
      scope: {
        caption: '@',
        pagination: '@',
        columns: '=columnsBind',
        records: '=recordsBind',
        search: '=searchBind'
      },
      link: function(scope, elem) {
        var searchControl = elem.find('input')[0];
        scope.$watch('search', function(val) {
          searchControl.value = val || '';
          angular.element(searchControl).triggerHandler('input');
        });
        scope.$watch('columns', function(columns) {
          if (!Array.isArray(columns)) {
            console.warn('Failed to create table, until columns are defined.');
            return;
          }
          scope.columnStyleClass = columns.map(function(column) {
            function addStyleClass(dest, clazz, condition) {
              if (condition) {
                dest.push(clazz);
              }
            }
            var array = [];
            addStyleClass(array, column.styleClass, column.styleClass !== undefined);
            addStyleClass(array, 'text-right', 'Number' === column.renderer);
            addStyleClass(array, 'text-nowrap', Array.isArray(column.key) && !column.vertical);
            return array.join(' ');
          });
          scope.multipleRendererColumnsRenderers = columns.map(function(column) {
            if (!Array.isArray(column.key)) {
              return null;
            }
            if (Array.isArray(column.renderer)) {
              if (column.renderer.length !== column.key.length) {
                console.warn('Every column key should have a renderer, or share one renderer.');
              }
              return column.renderer;
            }
            return column.key.map(function() {
              return column.renderer;
            });
          });
        });
        scope.isArray = Array.isArray;
      }
    };
  })
  .directive('stSummary', function() {
    return {
      require: '^stTable',
      template: 'Showing {{ stRange.from }}-{{ stRange.to }} of {{ totalItemCount }} records',
      link: function(scope, element, attrs, stTable) {
        scope.stRange = {
          from: null,
          to: null
        };
        scope.$watch('currentPage', function() {
          var pagination = stTable.tableState().pagination;
          scope.stRange.from = pagination.start + 1;
          scope.stRange.to = scope.currentPage === pagination.numberOfPages ?
            pagination.totalItemCount : (scope.stRange.from + scope.stItemsByPage - 1);
        });
      }
    };
  })
  .config(['stConfig', function(stConfig) {
    stConfig.sort.skipNatural = true;
  }])
;
angular.module('dashing.tabset', [])
  .directive('tabset', [function() {
    return {
      restrict: 'E',
      templateUrl: 'tabset/tabset.html',
      transclude: true,
      scope: true,
      controller: ['$scope', function($scope) {
        var tabs = $scope.tabs = [];
        function select(tab, reload) {
          angular.forEach(tabs, function(item) {
            item.selected = item === tab;
          });
          if (tab.load !== undefined) {
            tab.load(reload);
          }
        }
        this.addTab = function(tab) {
          tabs.push(tab);
          if (tabs.length === 1) {
            select(tab);
          }
        };
        $scope.selectTab = function(activeTabIndex, reload) {
          if (activeTabIndex >= 0 && activeTabIndex < tabs.length) {
            select(tabs[activeTabIndex], reload);
          }
        };
      }]
    };
  }])
  .directive('tab', ['$http', '$controller', '$compile',
    function($http, $controller, $compile) {
      return {
        restrict: 'E',
        require: '^tabset',
        template: '<div class="tab-pane" ng-class="{active:selected}" ng-transclude></div>',
        replace: true,
        transclude: true,
        link: function(scope, elem, attrs, ctrl) {
          scope.heading = attrs.heading;
          scope.loaded = false;
          scope.load = function(reload) {
            if (scope.loaded && !reload) {
              return;
            }
            if (attrs.template) {
              $http.get(attrs.template).then(function(response) {
                createTemplateScope(response.data);
              });
            }
          };
          function createTemplateScope(template) {
            elem.html(template);
            var templateScope = scope.$new(false);
            if (attrs.controller) {
              var scopeController = $controller(attrs.controller, {$scope: templateScope});
              elem.children().data('$ngController', scopeController);
            }
            $compile(elem.contents())(templateScope);
            scope.loaded = true;
          }
          ctrl.addTab(scope);
        }
      };
    }])
;
angular.module('dashing.util', [])
  .factory('$util', function() {
    return {
            conditionToBootstrapLabelClass: function(condition) {
        switch (condition) {
          case 'good':
            return 'label-success';
          case 'concern':
            return 'label-warning';
          case 'danger':
            return 'label-danger';
          default:
            return 'label-default';
        }
      },
            conditionToColor: function(condition) {
        switch (condition) {
          case 'good':
            return '#5cb85c';
          case 'concern':
            return '#f0ad4e';
          case 'danger':
            return '#d9534f';
          default:
            return '#aaa';
        }
      }
    };
  })
;
})(window, document);