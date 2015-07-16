/*
 * dashing
 * @version v0.0.4
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
  'dashing.help',
  'dashing.metrics',
  'dashing.progressbar',
  'dashing.property',
  'dashing.state',
  'dashing.tables.property-table',
  'dashing.tables.sortable-table',
  'dashing.tabset'
])
;
angular.module("dashing").run(["$templateCache", function($templateCache) {$templateCache.put("charts/metrics-sparkline-lr.html","<div class=\"row\"> <metrics class=\"{{metricsPartClass}}\" ng-class=\"{\'col-md-6\':!metricsPartClass}\" caption=\"{{caption}}\" ng-attr-help=\"{{help}}\" value=\"{{current}}\" unit=\"{{unit}}\" small-text=\"{{smallText}}\"></metrics> <sparkline class=\"{{chartPartClass}}\" ng-class=\"{\'col-md-6\':!chartPartClass}\" options-bind=\"options\" datasource-bind=\"data\"></sparkline> </div>");
$templateCache.put("charts/metrics-sparkline-td.html","<metrics caption=\"{{caption}}\" ng-attr-help=\"{{help}}\" value=\"{{current}}\" unit=\"{{unit}}\" small-text=\"{{smallText}}\"></metrics> <sparkline options-bind=\"options\" datasource-bind=\"data\"></sparkline>");
$templateCache.put("metrics/metrics.html","<div class=\"metrics\"> <div> <span ng-bind=\"caption\"></span> <help ng-if=\"help\" text=\"{{help}}\"></help> </div> <h3 class=\"metrics-value\"> <span ng-bind=\"value\"></span> <small ng-bind=\"unit\"></small> </h3> <small ng-if=\"smallText\" class=\"metrics-small-text\" ng-bind=\"smallText\"></small> </div>");
$templateCache.put("progressbar/progressbar.html","<div style=\"width:100%\">  <span class=\"small pull-left\" ng-bind=\"current+\'/\'+max\"></span> <span class=\"small pull-right\" ng-bind=\"usage + \'%\'\"></span> </div> <div style=\"width:100%\" class=\"progress progress-tiny\"> <div ng-class=\"\'progress-bar-\'+colorFn(usage)\" ng-style=\"{width:usage+\'%\'}\" class=\"progress-bar\"></div> </div>");
$templateCache.put("property/property.html","<div ng-switch=\"renderer\">  <a ng-switch-when=\"Link\" ng-href=\"{{href}}\" ng-bind=\"text\" ng-attr-class=\"{{class}}\" bs-tooltip=\"tooltip\"></a>  <state ng-switch-when=\"State\" text=\"{{text}}\" condition=\"{{condition}}\"></state>  <indicator ng-switch-when=\"Indicator\" text=\"{{text}}\" condition=\"{{condition}}\"></indicator>  <progressbar ng-switch-when=\"ProgressBar\" current=\"{{current}}\" max=\"{{max}}\"></progressbar>  <span ng-switch-when=\"Duration\" ng-bind=\"value|duration\"></span>  <span ng-switch-default ng-bind=\"value\"></span> </div>");
$templateCache.put("tables/property-table/property-table.html","<table class=\"table table-striped table-condensed\"> <caption ng-if=\"caption\" ng-bind=\"caption\"></caption> <tbody> <tr ng-repeat=\"prop in props track by $index\"> <td ng-class=\"propNameClass\"> <span ng-bind=\"prop.name\"></span> <help ng-if=\"prop.help\" text=\"{{prop.help}}\"></help> </td> <td ng-switch=\"prop.hasOwnProperty(\'values\')\" ng-class=\"propValueClass\"> <div ng-switch-when=\"true\" ng-repeat=\"value in prop.values track by $index\"> <div ng-class=\"{\'props-in-one-line\':!prop.vertical}\"> <property value-bind=\"value\" renderer=\"{{prop.renderer}}\"></property> </div> </div> <div ng-switch-default> <property value-bind=\"prop.value\" renderer=\"{{prop.renderer}}\"></property> </div> </td> </tr> </tbody> </table>");
$templateCache.put("tables/sortable-table/sortable-table-pagination.html","<div ng-if=\"pages.length>=2\"> <div class=\"btn-group btn-group-xs\">  <button type=\"button\" class=\"btn btn-default\" ng-class=\"{disabled:1==currentPage}\" ng-click=\"selectPage(currentPage-1)\"> &laquo;</button> <button type=\"button\" class=\"btn btn-default\" ng-repeat=\"page in pages track by $index\" ng-class=\"{active:page==currentPage}\" ng-click=\"selectPage(page)\"> {{page}} </button> <button type=\"button\" class=\"btn btn-default\" ng-class=\"{disabled:numPages==currentPage}\" ng-click=\"selectPage(currentPage+1)\"> &raquo;</button>  </div> </div>");
$templateCache.put("tables/sortable-table/sortable-table.html","<table class=\"table table-striped table-condensed\" st-table=\"showing\" st-safe-src=\"records\"> <caption ng-if=\"caption\" ng-bind=\"caption\"></caption> <thead> <tr> <th ng-repeat=\"col in columns track by $index\" ng-class=\"stylingFn(col)\" ng-attr-st-sort=\"{{col.sortKey}}\" st-sort-default=\"{{col.defaultSort}}\">{{col.name}} <help ng-if=\"col.hasOwnProperty(\'help\')\" text=\"{{col.help}}\"></help> </th> </tr> <tr ng-show=\"false\"> <th colspan=\"{{columns.length}}\">  <input type=\"text\" st-search>  <div st-pagination st-items-by-page=\"pagination\"></div> </th> </tr> </thead> <tbody> <tr ng-repeat=\"record in showing track by $index\"> <td ng-repeat=\"col in columns track by $index\" ng-class=\"stylingFn(col)\"> <div ng-switch=\"isArray(col.key)\"> <div ng-switch-when=\"true\" ng-repeat=\"childKey in col.key track by $index\"> <div ng-class=\"{\'props-in-one-line\':!col.vertical}\"> <property value-bind=\"record[childKey]\" renderer=\"{{col.renderer[$index]}}\"></property> </div> </div> <div ng-switch-default> <property value-bind=\"record[col.key]\" renderer=\"{{col.renderer}}\"></property> </div> </div> </td> </tr> <tr ng-if=\"showing.length===0\"> <td colspan=\"{{columns.length}}\" class=\"text-center\"> <i>No data found</i> </td> </tr> <tr ng-if=\"showing.length<pagination\" ng-repeat=\"i in range(pagination-showing.length) track by $index\"> <td colspan=\"{{columns.length}}\"> <span ng-bind-html=\"emptyRowContent\"></span> </td> </tr> </tbody> <tfoot ng-if=\"records.length>0\"> <tr> <td colspan=\"{{columns.length}}\"> <div class=\"pull-left\"> Total: <span ng-bind=\"records.length\"></span> </div> <div class=\"pull-right\" st-pagination st-items-by-page=\"pagination\" st-template=\"tables/sortable-table/sortable-table-pagination.html\"></div> </td> </tr> </tfoot> </table>");
$templateCache.put("tabset/tabset.html","<ul class=\"nav nav-tabs nav-tabs-underlined\"> <li ng-repeat=\"tab in tabs track by $index\" ng-class=\"{active:tab.selected}\"> <a href=\"\" ng-click=\"selectTab(tab)\" ng-bind=\"tab.heading\"></a> </li> </ul> <div class=\"tab-content\" ng-transclude></div>");}]);
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
              chart.addData(dataArray);
            } catch (ex) {
            }
          }
        });
      }
    };
  }])
  .factory('$echarts', function() {
    return {
            tooltip: function(args) {
        var result = {
          trigger: args.trigger || 'axis',
          textStyle: {fontSize: 12},
          axisPointer: {type: 'none'},
          borderRadius: 2,
          formatter: args.formatter,
          position: function(p) {
            return [p[0], 22];
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
          smooth: args.smooth || true,
          itemStyle: {
            normal: {
              lineStyle: {color: args.colors.line, width: 3}
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
            type: 'default', color: args.colors.area
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
        var use = $scope.options;
        var data = $echarts.splitDataArray($scope.data, use.maxDataNum);
        var colorPalette = $echarts.colorPalette(use.seriesNames.length);
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
          grid: {borderWidth: 0, y: 10, x2: 5, y2: 22},
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
            splitNumber: use.yAxisValuesNum || 3,
            splitLine: {show: false},
            axisLine: {show: false}
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
              stack: use.hasOwnProperty('stacked') ? use.stacked : true,
              showAllSymbol: true,
              data: data.head.map(function(item) {
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
      }
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
          grid: {borderWidth: 0, x: 5, y: 5, x2: 5, y2: 0},
          xAxis: [{
            boundaryGap: false,
            axisLabel: false,
            splitLine: false,
            data: data.head.map(function(item) {
              return item.x;
            })
          }],
          yAxis: [{show: false}],
          xAxisDataNum: use.maxDataNum,
          series: [$echarts.makeDataSeries({
            colors: colors, stack: true ,
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
angular.module('dashing.help', [
  'mgcrea.ngStrap.tooltip'
])
  .directive('help', function() {
    return {
      template: '<span class="glyphicon glyphicon-question-sign help-icon" bs-tooltip="text"></span>',
      restrict: 'E',
      scope: {
        text: '@'
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
      templateUrl: 'progressbar/progressbar.html',
      restrict: 'E',
      scope: {
        current: '@',
        max: '@'
      },
      controller: ['$scope', function($scope) {
        $scope.$watch('[current, max]', function() {
          $scope.usage = $scope.max > 0 ?
            Math.round($scope.current * 100 / $scope.max) : -1;
        });
        $scope.colorFn = function(usage) {
          return usage < 50 ? 'info' : (usage < 75 ? 'warning' : 'danger');
        };
      }]
    };
  })
;
angular.module('dashing.property', [])
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
                $scope.class = value.class;
                $scope.tooltip = value.tooltip;
                break;
              case 'State':
                $scope.text = value.text;
                $scope.condition = value.condition;
                break;
              case 'Indicator':
                $scope.text = value.text;
                $scope.condition = value.condition;
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
angular.module('dashing.state', [
  'mgcrea.ngStrap.tooltip'
])
  .directive('state', function() {
    return {
      template: '<span ng-class="classFn(condition,text)" class="label" ng-bind="text"></span>',
      restrict: 'E',
      scope: {
        condition: '@',
        text: '@'
      },
      controller: ['$scope', function($scope) {
        $scope.classFn = function(condition, text) {
          var clazz = text ? 'label-lg ' : '';
          switch (condition) {
            case 'good':
              return clazz + 'label-success';
            case 'concern':
              return clazz + 'label-warning';
            case 'danger':
              return clazz + 'label-danger';
            default:
              return clazz + 'label-default';
          }
        };
      }]
    };
  })
  .directive('indicator', function() {
    return {
      template: '<small ng-style="{color:colorFn(condition)}" class="glyphicon glyphicon-stop" bs-tooltip="text"></small>',
      restrict: 'E',
      scope: {
        condition: '@',
        text: '@'
      },
      controller: ['$scope', function($scope) {
        $scope.colorFn = function(condition) {
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
        };
      }]
    };
  })
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
        emptyRowAsBr: '=',
        columns: '=columnsBind',
        records: '=recordsBind',
        search: '=searchBind'
      },
      controller: ['$scope', '$element', '$sce', function($scope, $element, $sce) {
        var elem = $element.find('input')[0];
        $scope.$watch('search', function(val) {
          elem.value = val || '';
          angular.element(elem).triggerHandler('input');
        });
        $scope.$watch('emptyRowAsBr', function(val) {
          $scope.emptyRowContent = $sce.trustAsHtml(
            angular.isDefined(val) ?
              (val > 0 ? $scope.range(Number(val), '<br/>').join('') : '') :
              '&nbsp;'
          );
        });
        $scope.stylingFn = function(col) {
          return col.style +
            (['Number'].indexOf(col.renderer) !== -1 ? ' text-right' : '');
        };
        $scope.isArray = angular.isArray;
        $scope.range = function(count, fill) {
          return count > 0 ?
            Array.apply(null, {length: count}).map(function(_, index) {
              return fill || index;
            }) : [];
        };
      }]
    };
  })
  .config(['stConfig', function(stConfig) {
    stConfig.sort.skipNatural = true;
  }])
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
                  var templateScope = scope.$new();
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
})(window, document);