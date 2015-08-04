/*
 * dashing (assembled widgets)
 * @version v0.0.7
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
  'dashing.charts.sparkline',
  'dashing.contextmenu',
  'dashing.forms.searchbox',
  'dashing.metrics',
  'dashing.progressbar',
  'dashing.property',
  'dashing.remark',
  'dashing.state.indicator',
  'dashing.state.tag',
  'dashing.tables.property-table',
  'dashing.tables.sortable-table',
  'dashing.tabset',
  'dashing.util'
])
;
angular.module('dashing').run(['$templateCache', function($templateCache) {$templateCache.put('charts/metrics-sparkline-lr.html','<div class="row"> <metrics class="{{metricsPartClass}}" ng-class="{\'col-md-6\':!metricsPartClass}" caption="{{caption}}" ng-attr-help="{{help}}" value="{{current}}" unit="{{unit}}" small-text="{{smallText}}"></metrics> <sparkline class="{{chartPartClass}}" ng-class="{\'col-md-6\':!chartPartClass}" options-bind="options" datasource-bind="data"></sparkline> </div>');
$templateCache.put('charts/metrics-sparkline-td.html','<metrics caption="{{caption}}" ng-attr-help="{{help}}" value="{{current}}" unit="{{unit}}" small-text="{{smallText}}"></metrics> <sparkline options-bind="options" datasource-bind="data"></sparkline>');
$templateCache.put('forms/searchbox.html','<div class="search-control"> <span class="glyphicon glyphicon-search"></span> <input type="text" class="form-control" ng-model="ngModel" placeholder="{{placeholder}}"> </div>');
$templateCache.put('metrics/metrics.html','<div class="metrics"> <div> <span class="metrics-caption" ng-bind="caption"></span> <remark ng-if="help" type="question" tooltip="{{help}}"></remark> </div> <h3 class="metrics-value"> <span ng-bind="value"></span> <small ng-bind="unit"></small> </h3> <small ng-if="smallText" class="metrics-small-text" ng-bind="smallText"></small> </div>');
$templateCache.put('progressbar/progressbar.html','<div style="width:100%">  <span class="small pull-left" ng-bind="current+\'/\'+max"></span> <span class="small pull-right" ng-bind="usage + \'%\'"></span> </div> <div style="width:100%" class="progress progress-tiny"> <div ng-style="{width:usage+\'%\'}" class="progress-bar {{usageClass}}"></div> </div>');
$templateCache.put('property/property.html','<ng-switch on="renderer">  <a ng-switch-when="Link" ng-href="{{href}}" ng-bind="text"></a>  <button ng-switch-when="Button" ng-if="!hide" type="button" class="btn btn-default {{class}}" ng-bind="text" ng-click="click()" ng-disabled="disabled"></button>  <tag ng-switch-when="Tag" ng-attr-href="{{href}}" text="{{text}}" condition="{{condition}}" tooltip="{{tooltip}}"></tag>  <indicator ng-switch-when="Indicator" condition="{{condition}}" tooltip="{{tooltip}}"></indicator>  <progressbar ng-switch-when="ProgressBar" current="{{current}}" max="{{max}}"></progressbar>  <span ng-switch-when="Duration" ng-bind="value|duration"></span>  <span ng-switch-when="DateTime" ng-bind="value|date:\'yyyy-MM-dd HH:MM:ss\'"></span>  <span ng-switch-when="Number" ng-bind="value|number:0"></span>  <span ng-switch-default ng-bind="value"></span> </ng-switch>');
$templateCache.put('remark/remark.html','<span class="{{fontClass}} remark-icon" bs-tooltip="tooltip"></span>');
$templateCache.put('state/indicator.html','<small ng-style="{color:colorStyle, cursor:cursorStyle}" class="glyphicon glyphicon-stop" bs-tooltip="tooltip"></small>');
$templateCache.put('state/tag.html','<ng-switch on="!href"> <a ng-switch-when="false" ng-href="{{href}}" class="label label-lg {{labelColorClass}}" ng-bind="text" bs-tooltip="tooltip"></a> <span ng-switch-when="true" class="label label-lg {{labelColorClass}}" ng-style="{cursor:cursorStyle}" ng-bind="text" bs-tooltip="tooltip"></span> </ng-switch>');
$templateCache.put('tables/property-table/property-table.html','<table class="table table-striped table-hover"> <caption ng-if="caption" ng-bind="caption"></caption> <tbody> <tr ng-repeat="prop in props track by $index"> <td ng-class="propNameClass"> <span ng-bind="prop.name"></span> <remark ng-if="prop.help" type="question" tooltip="{{prop.help}}"></remark> </td> <td ng-class="propValueClass"> <ng-switch on="prop.hasOwnProperty(\'values\')"> <property ng-switch-when="true" ng-repeat="value in prop.values track by $index" value-bind="value" renderer="{{prop.renderer}}"></property> <property ng-switch-when="false" value-bind="prop.value" renderer="{{prop.renderer}}"></property> </ng-switch> </td> </tr> </tbody> </table>');
$templateCache.put('tables/sortable-table/sortable-table-pagination.html','<div class="pull-left"> <st-summary></st-summary> </div> <div class="pull-right"> <div ng-if="pages.length >= 2" class="btn-group btn-group-xs">  <button type="button" class="btn btn-default" ng-class="{disabled:1==currentPage}" ng-click="selectPage(currentPage-1)"> &laquo;</button> <button type="button" class="btn btn-default" ng-repeat="page in pages track by $index" ng-class="{active:page==currentPage}" ng-click="selectPage(page)"> {{page}} </button> <button type="button" class="btn btn-default" ng-class="{disabled:numPages==currentPage}" ng-click="selectPage(currentPage+1)"> &raquo;</button>  </div> </div>');
$templateCache.put('tables/sortable-table/sortable-table.html','<table class="table table-striped table-hover" st-table="showing" st-safe-src="records"> <caption ng-if="caption" ng-bind="caption"></caption> <thead> <tr> <th ng-repeat="col in columns track by $index" ng-class="stylingFn(col)" ng-attr-st-sort="{{col.sortKey}}" ng-attr-st-sort-default="{{col.defaultSort}}">{{col.name}} <remark ng-if="col.help" type="question" tooltip="{{col.help}}"></remark> <span ng-if="col.unit" ng-bind="col.unit"></span> </th> </tr> <tr ng-show="false"> <th colspan="{{columns.length}}">  <input type="text" st-search>  <div st-pagination st-items-by-page="pagination"></div> </th> </tr> </thead> <tbody> <tr ng-repeat="record in showing track by $index"> <td ng-repeat="col in columns track by $index" ng-class="stylingFn(col)"> <ng-switch on="isArray(col.key)"> <property ng-switch-when="true" ng-repeat="subKey in col.key track by $index" value-bind="record[subKey]" renderer="{{get(col.renderer, $index)}}"></property> <property ng-switch-when="false" value-bind="record[col.key]" renderer="{{col.renderer}}"></property> </ng-switch> </td> </tr> <tr ng-if="records !== null && !showing.length"> <td colspan="{{columns.length}}" class="text-center"> <i>No data found</i> </td> </tr> </tbody> <tfoot ng-if="records.length"> <tr> <td colspan="{{columns.length}}" st-pagination st-items-by-page="pagination" st-template="tables/sortable-table/sortable-table-pagination.html"> </td> </tr> </tfoot> </table>');
$templateCache.put('tabset/tabset.html','<ul class="nav nav-tabs nav-tabs-underlined"> <li ng-repeat="tab in tabs track by $index" ng-class="{active:tab.selected}"> <a href="" ng-click="selectTab(tab)" ng-bind="tab.heading"></a> </li> </ul> <div class="tab-content" ng-transclude></div>');}]);
angular.module('dashing.charts.bar', [
  'dashing.charts.echarts'
])
  .directive('barChart', [function() {
    return {
      template: '<echart options="echartOptions" data="data"></echart>',
      restrict: 'E',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = $scope.options;
        var data = $scope.data;
        var colors = $echarts.colorPalette(0)[0];
        $scope.echartOptions = {
          height: use.height, width: use.width,
          tooltip: $echarts.tooltip({
            color: colors.grid,
            trigger: 'item'
          }),
          grid: {borderWidth: 0, x: 45, y: 5, x2: 5, y2: 42},
          xAxis: [{
            axisLabel: {show: false},
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false},
            data: data.map(function(item) {
              return item.x;
            })
          }],
          yAxis: [{show: false}],
          xAxisDataNum: use.maxDataNum,
          dataZoom: {show: true, handleColor: 'rgb(188,188,188)', fillerColor: 'rgba(188,188,188,.15)'},
          series: [$echarts.makeDataSeries({
            colors: colors,
            type: 'bar', barWidth: 7, barMaxWidth: 7, barGap: 2, barCategoryGap: 2, smooth:false,
            data: data.map(function(item) {
              return item.y;
            })
          })]
        };
      }]
    };
  }])
;
angular.module('dashing.charts.echarts', [])
  .directive('echart', ['$echarts', function($echarts) {
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
        chart.setOption(options, true);
        scope.$watch('data', function(data) {
          if (data) {
            try {
              var actualVisibleDataPoints = chart.getOption().xAxis[0].data.length;
              var visibleDataPoints = Math.min(
                80 ,
                Math.max(0, options.xAxisDataNum - actualVisibleDataPoints));
              var dataArray = $echarts.makeDataArray(visibleDataPoints, data);
              if (dataArray.length > 0) {
                if (data.yAxisMax) {
                  chart.setOption({
                    yAxis: [{max: data.yAxisMax}]
                  }, false);
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
  .factory('$echarts', function() {
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
            tooltipFirstSeriesFormatter: function(valueFormatter) {
        return function(params) {
          var color = params[0].series.colors.line;
          return params[0].name +
            '<table>' +
            '<tr>' +
            '<td>' + self.tooltipSeriesColorIndicatorHtml(color) + '</td>' +
            '<td style="padding-left:4px">' + valueFormatter(params[0].value) + '</td>' +
            '</tr>' +
            '</table>';
        };
      },
            tooltipAllSeriesFormatter: function(valueFormatter) {
        return function(params) {
          return params[0].name +
            '<table>' +
            params.map(function(param) {
              var color = param.series.colors.line;
              return '<tr>' +
                '<td>' + self.tooltipSeriesColorIndicatorHtml(color) + '</td>' +
                '<td style="padding:0 12px 0 4px">' + param.seriesName + '</td>' +
                '<td>' + valueFormatter(param.value) + '</td>' +
                '</tr>';
            }).join('') + '</table>';
        };
      },
      tooltipSeriesColorIndicatorHtml: function(color) {
        return '<div style="width:7px;height:7px;background-color:' + color + '"></div>';
      },
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
          options.itemStyle.normal.lineStyle.width -= 1;
        }
        return angular.merge(args, options);
      },
            makeDataArray: function(visibleDataPoints, data) {
        function ensureArray(obj) {
          return Array.isArray(obj) ? obj : [obj];
        }
        var array = [];
        angular.forEach(ensureArray(data), function(datum) {
          var dataGrow = visibleDataPoints-- > 0;
          angular.forEach(ensureArray(datum.y), function(value, seriesIndex) {
            var params = [seriesIndex, value, false, dataGrow];
            if (seriesIndex === 0) {
              params.push(datum.x);
            }
            array.push(params);
          });
        });
        return array;
      },
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
            colorPalette: function(size) {
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
angular.module('dashing.charts.line', [
  'dashing.charts.echarts'
])
  .directive('lineChart', function() {
    return {
      template: '<echart options="echartOptions" data="data"></echart>',
      restrict: 'E',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = angular.merge({
          stacked: true,
          yAxisValuesNum: 3
        }, $scope.options);
        var data = $echarts.splitDataArray($scope.data, use.maxDataNum);
        var colorPalette = $echarts.colorPalette(use.seriesNames.length);
        var borderLineStyle = {
          lineStyle: {
            width: 1,
            color: '#ddd'
          }
        };
        var options = {
          height: use.height,
          width: use.width,
          tooltip: $echarts.tooltip({
            color: 'rgb(235,235,235)',
            formatter: use.tooltipFormatter ?
              use.tooltipFormatter :
              $echarts.tooltipAllSeriesFormatter(
                use.valueFormatter || function(value) {
                  return value;
                }
              )
          }),
          dataZoom: {show: false},
          grid: {
            borderWidth: 0,
            y: 20,
            x2: 5,
            y2: 23
          },
          xAxis: [{
            boundaryGap: false,
            axisLine: borderLineStyle,
            axisTick: borderLineStyle,
            axisLabel: {show: true},
            splitLine: false,
            data: data.head.map(function(item) {
              return item.x;
            })
          }],
          yAxis: [{
            splitNumber: use.yAxisValuesNum,
            splitLine: {show: false},
            axisLine: {show: false},
            scale: use.scale
          }],
          xAxisDataNum: use.maxDataNum,
          series: [],
          color: use.seriesNames.map(function(_, i) {
            return colorPalette[i % colorPalette.length].line;
          })
        };
        angular.forEach(use.seriesNames, function(name, i) {
          options.series.push(
            $echarts.makeDataSeries({
              name: name,
              colors: colorPalette[i % colorPalette.length],
              stack: use.stacked,
              showAllSymbol: true,
              data: data.head.map(function(item) {
                return item.y[i];
              })
            })
          );
        });
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
        $scope.showLegend = options.series.length > 1;
        if ($scope.showLegend) {
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
        if ($scope.showLegend || use.title) {
          options.grid.y += 12;
        }
        $scope.echartOptions = options;
        if (data.tail.length) {
          $scope.data = data.tail;
        }
      }]
    };
  })
;
angular.module('dashing.charts.metrics-sparkline', [
  'dashing.charts.sparkline',
  'dashing.metrics'
])
  .directive('metricsSparklineTd', function() {
    return {
      templateUrl: 'charts/metrics-sparkline-td.html',
      restrict: 'E',
      scope: {
        caption: '@',
        help: '@',
        current: '@',
        unit: '@',
        smallText: '@',
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      controller: ['$scope', function($scope) {
        $scope.options.grid = {y: 12};
      }]
    };
  })
  .directive('metricsSparklineLr', function() {
    return {
      templateUrl: 'charts/metrics-sparkline-lr.html',
      restrict: 'E',
      scope: {
        caption: '@',
        help: '@',
        current: '@',
        unit: '@',
        smallText: '@',
        options: '=optionsBind',
        data: '=datasourceBind',
        metricsPartClass: '@',
        chartPartClass: '@'
      },
      controller: ['$timeout', function($timeout) {
        $timeout(function() {
          angular.element(window).triggerHandler('resize');
        });
      }]
    };
  })
;
angular.module('dashing.charts.sparkline', [
  'dashing.charts.echarts'
])
  .directive('sparkline', function() {
    return {
      template: '<echart options="echartOptions" data="data"></echart>',
      restrict: 'E',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = $scope.options;
        var colors = $echarts.colorPalette(1)[0];
        var data = $echarts.splitDataArray($scope.data, use.maxDataNum);
        $scope.echartOptions = {
          height: use.height,
          width: use.width,
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
          grid: angular.merge({
            borderWidth: 1,
            x: 5,
            y: 5,
            x2: 5,
            y2: 1           }, use.grid),
          xAxis: [{
            boundaryGap: false,
            axisLabel: false,
            splitLine: false,
            data: data.head.map(function(item) {
              return item.x;
            })
          }],
          yAxis: [{
            show: false,
            scale: use.scale
          }],
          xAxisDataNum: use.maxDataNum,
          series: [$echarts.makeDataSeries({
            colors: colors,
            stack: true ,
            data: data.head.map(function(item) {
              return item.y;
            })
          })]
        };
        if (data.tail.length) {
          $scope.data = data.tail;
        }
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
        angular.element(elem).css({left: position.x + 'px', top: position.y + 'px'});
        angular.element(elem).triggerHandler('click');
      }
    };
  })
;
angular.module('dashing.forms.searchbox', [
])
  .directive('searchbox', function() {
    return {
      templateUrl: 'forms/searchbox.html',
      restrict: 'E',
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
      templateUrl: 'metrics/metrics.html',
      restrict: 'E',
      scope: {
        caption: '@',
        help: '@',
        value: '@',
        unit: '@',
        smallText: '@'
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
        max: '@'
      },
      link: function(scope, elem, attrs) {
        attrs.$observe('current', function(current) {
          updateUsageAndClass(Number(current), Number(attrs.max));
        });
        attrs.$observe('max', function(max) {
          updateUsageAndClass(Number(attrs.current), Number(max));
        });
        function updateUsageAndClass(current, max) {
          scope.usage = max > 0 ?
            Math.round(current * 100 / max) : -1;
          scope.usageClass = 'progress-bar-' +
            (scope.usage < 50 ? 'info' : (scope.usage < 75 ? 'warning' : 'danger'));
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
      templateUrl: 'property/property.html',
      restrict: 'E',
      replace: false,
      scope: {
        value: '=valueBind',
        renderer: '@'
      },
      controller: ['$scope', function($scope) {
        $scope.$watch('value', function(value) {
          if (value) {
            switch ($scope.renderer) {
              case 'ProgressBar':
                $scope.current = value.current;
                $scope.max = value.max;
                break;
              case 'Link':
                $scope.href = value.href;
                $scope.text = value.text || value.href;
                break;
              case 'Tag':
                $scope.href = value.href;
                $scope.text = value.text;
                $scope.condition = value.condition;
                $scope.tooltip = value.tooltip;
                break;
              case 'Button':
                $scope.text = value.text;
                $scope.class = value.class;
                $scope.click = value.click;
                $scope.disabled = value.disabled;
                $scope.hide = value.hide;
                break;
              case 'Indicator':
                $scope.condition = value.condition;
                $scope.tooltip = value.tooltip;
                break;
            }
          }
        });
      }]
    };
  })
  .filter('duration', function() {
    return function(millis) {
      var x = parseInt(millis, 10);
      if (isNaN(x)) {
        return millis;
      }
      var units = [
        {label: "ms", mod: 1000},
        {label: "secs", mod: 60},
        {label: "mins", mod: 60},
        {label: "hours", mod: 24},
        {label: "days", mod: 7},
        {label: "weeks", mod: 52}
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
      if (duration.length > 1 && duration[1].label === "ms") {
        duration = [duration[0]];
      }
      return duration.map(function(unit) {
        return unit.value + " " + unit.label;
      }).join(" and ");
    };
  })
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
        if (!attrs.type) {
          attrs.type = 'question';
        }
                attrs.$observe('type', function(type) {
          switch (type) {
            case 'info':
              scope.fontClass = 'glyphicon glyphicon-info-sign';
              break;
            case 'warning':
              scope.fontClass = 'glyphicon glyphicon-exclamation-sign';
              break;
            case 'question':
            default:
              scope.fontClass = 'glyphicon glyphicon-question-sign';
              break;
          }
        });
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
        tooltip: '@'
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
angular.module('dashing.tables.property-table', [])
  .directive('propertyTable', function () {
    return {
      templateUrl: 'tables/property-table/property-table.html',
      restrict: 'E',
      scope: {
        caption: '@',
        props: '=propsBind',
        propNameClass: '@',
        propValueClass: '@'
      }
    };
  })
  .factory('$ptBuilder', function() {
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
    PB.prototype.done = function() {
      return this.props;
    };
    return {
      button: function(title) {
        return new PB('Button', title);
      },
      datetime: function(title) {
        return new PB('DateTime', title);
      },
      duration: function(title) {
        return new PB('Duration', title);
      },
      indicator: function(title) {
        return new PB('Indicator');
      },
      link: function(title) {
        return new PB('Link', title);
      },
      number: function(title) {
        return new PB('Number', title);
      },
      progressbar: function(title) {
        return new PB('ProgressBar', title);
      },
      tag: function(title) {
        return new PB('Tag', title);
      },
      text: function(title) {
        return new PB(undefined, title);
      }
    };
  })
;
angular.module('dashing.tables.sortable-table', [
  'smart-table'
])
  .directive('sortableTable', function() {
    return {
      templateUrl: 'tables/sortable-table/sortable-table.html',
      restrict: 'E',
      scope: {
        caption: '@',
        pagination: '@',
        columns: '=columnsBind',
        records: '=recordsBind',
        search: '=searchBind'
      },
      controller: ['$scope', '$element', function($scope, $element) {
        var elem = $element.find('input')[0];
        $scope.$watch('search', function(val) {
          elem.value = val || '';
          angular.element(elem).triggerHandler('input');
        });
        $scope.stylingFn = function(col) {
          var result = [];
          if (col.styleClass) {
            result.push(col.styleClass);
          }
          if ('Number' === col.renderer) {
            result.push('text-right');
          }
          if (angular.isArray(col.key) && !col.vertical) {
            result.push('text-nowrap');
          }
          return result.join(' ');
        };
        $scope.isArray = angular.isArray;
        $scope.get = function(obj, index) {
          return angular.isArray(obj) ? obj[index] : obj;
        };
      }]
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
  .factory('$stColBuilder', function() {
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
    CB.prototype.keyCanSort = function(key, sortDefaultAscent) {
      this.props.key = key;
      this.props.sortKey = key;
      if (sortDefaultAscent !== undefined) {
        this.props.defaultSort =
          ['reverse', false].indexOf(sortDefaultAscent) !== -1 ? 'reverse' : true;
      }
      return this;
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
        return new CB('Button', title);
      },
      datetime: function(title) {
        return new CB('DateTime', title);
      },
      duration: function(title) {
        return new CB('Duration', title);
      },
      indicator: function(title) {
        return new CB('Indicator', title);
      },
      link: function(title) {
        return new CB('Link', title);
      },
      number: function(title) {
        return new CB('Number', title);
      },
      progressbar: function(title) {
        return new CB('ProgressBar', title);
      },
      tag: function(title) {
        return new CB('Tag', title);
      },
      text: function(title) {
        return new CB(undefined, title);
      },
      $check: function(cols, model) {
        angular.forEach(cols, function(col) {
          var keys = angular.isArray(col.key) ? col.key : [col.key];
          angular.forEach(keys, function(key) {
            if (!model.hasOwnProperty(key)) {
              console.warn('Model does not have a property matches column key `' + col + '`');
            }
          });
        });
      }
    };
  })
;
angular.module('dashing.tabset', [])
  .directive('tabset', [function() {
    return {
      templateUrl: 'tabset/tabset.html',
      restrict: 'E',
      transclude: true,
      scope: {
        switchTo: '='
      },
      controller: ['$scope', function($scope) {
        var tabs = $scope.tabs = [];
        $scope.selectTab = function(tab, reload) {
          angular.forEach(tabs, function(item) {
            item.selected = item === tab;
          });
          if (tab.load !== undefined) {
            tab.load(reload);
          }
        };
        this.addTab = function(tab) {
          tabs.push(tab);
          if (tabs.length === 1) {
            $scope.selectTab(tab);
          }
        };
        $scope.$watch('switchTo', function(args) {
          if (args) {
            var tabIndex = args.tabIndex;
            if (tabIndex >= 0 && tabIndex < tabs.length) {
              $scope.selectTab(tabs[tabIndex], args.reload);
            }
            $scope.switchTo = null;
          }
        });
      }]
    };
  }])
  .directive('tab', ['$http', '$controller', '$compile',
    function($http, $controller, $compile) {
      return {
        require: '^tabset',
        restrict: 'E',
        transclude: true,
        link: function(scope, elem, attrs, tabsCtrl) {
          scope.heading = attrs.heading;
          if (attrs.template) {
            scope.loaded = false;
            scope.load = function(reload) {
              if (scope.loaded && !reload) {
                return;
              }
              $http.get(attrs.template)
                .then(function(response) {
                  var templateScope = scope.$new(false);
                  elem.html(response.data);
                  if (attrs.controller) {
                    elem.children().data('$ngController',
                      $controller(attrs.controller, {$scope: templateScope}));
                  }
                  $compile(elem.contents())(templateScope);
                  scope.loaded = true;
                });
            };
          }
          tabsCtrl.addTab(scope);
        },
        template: '<div class="tab-pane" ng-class="{active:selected}" ng-transclude></div>',
        replace: true
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
            return '#777';
        }
      }
    };
  })
;
})(window, document);