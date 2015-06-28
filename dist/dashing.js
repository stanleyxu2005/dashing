/*
 * dashing
 * @version v0.0.2
 * @link https://github.com/stanleyxu2005/dashing
 * @license Apache License 2.0, see accompanying LICENSE file
 */
(function(window, document, undefined) {
'use strict';
angular.module('dashing', [
  'dashing.charts',
  'dashing.charts-comp',
  'dashing.help',
  'dashing.metrics',
  'dashing.progressbar',
  'dashing.property',
  'dashing.property-table',
  'dashing.sortable-table',
  'dashing.state',
  'dashing.tabset'
])
;
angular.module("dashing").run(["$templateCache", function($templateCache) {$templateCache.put("charts/sparkline-chart-metrics-left.html","<div class=\"row\"> <metrics class=\"col-md-4\" style=\"{{metricsStyleFix}}\" caption=\"{{caption}}\" ng-attr-help=\"{{help}}\" value=\"{{current}}\" unit=\"{{unit}}\" small-text=\"{{smallText}}\"></metrics> <sparkline-chart class=\"col-md-offset-1 col-md-7\" options-bind=\"options\" datasource-bind=\"data\"></sparkline-chart> </div>");
$templateCache.put("charts/sparkline-chart-metrics-top.html","<metrics caption=\"{{caption}}\" ng-attr-help=\"{{help}}\" value=\"{{current}}\" unit=\"{{unit}}\"></metrics> <sparkline-chart options-bind=\"options\" datasource-bind=\"data\"></sparkline-chart>");
$templateCache.put("metrics/metrics.html","<div class=\"metrics\"> <div> <span ng-bind=\"caption\"></span> <help ng-if=\"help\" text=\"{{help}}\"></help> </div> <h3 class=\"metrics-value\"> <span ng-bind=\"value\"></span> <small ng-bind=\"unit\"></small> </h3> <small ng-if=\"smallText\" class=\"metrics-small-text\" ng-bind=\"smallText\"></small> </div>");
$templateCache.put("progressbar/progressbar.html","<div style=\"width:100%\">  <span class=\"small pull-left\" ng-bind=\"current+\'/\'+max\"></span> <span class=\"small pull-right\" ng-bind=\"usage + \'%\'\"></span> </div> <div style=\"width:100%\" class=\"progress progress-tiny\"> <div ng-class=\"\'progress-bar-\'+colorFn(usage)\" ng-style=\"{width:usage+\'%\'}\" class=\"progress-bar\"></div> </div>");
$templateCache.put("property-table/property-table.html","<table class=\"table table-striped table-condensed\"> <caption ng-if=\"caption\" ng-bind=\"caption\"></caption> <tbody> <tr ng-repeat=\"prop in props track by $index\"> <td ng-class=\"propNameClass\"> <span ng-bind=\"prop.name\"></span> <help ng-if=\"prop.help\" text=\"{{prop.help}}\"></help> </td> <td ng-switch=\"prop.hasOwnProperty(\'values\')\" ng-class=\"propValueClass\"> <div ng-switch-when=\"true\" ng-repeat=\"value in prop.values track by $index\"> <property value-bind=\"value\" renderer=\"{{prop.renderer}}\"></property> </div> <div ng-switch-default> <property value-bind=\"prop.value\" renderer=\"{{prop.renderer}}\"></property> </div> </td> </tr> </tbody> </table>");
$templateCache.put("property/property.html","<div ng-switch=\"renderer\">  <a ng-switch-when=\"Link\" ng-href=\"{{href}}\" ng-bind=\"text\"></a>  <state ng-switch-when=\"State\" text=\"{{text}}\" condition=\"{{condition}}\"></state>  <indicator ng-switch-when=\"Indicator\" text=\"{{text}}\" condition=\"{{condition}}\"></indicator>  <progressbar ng-switch-when=\"ProgressBar\" current=\"{{current}}\" max=\"{{max}}\"></progressbar>  <span ng-switch-when=\"Duration\" ng-bind=\"value|duration\"></span>  <span ng-switch-default ng-bind=\"value\"></span> </div>");
$templateCache.put("sortable-table/sortable-table-pagination.html","<div ng-if=\"pages.length >= 2\"> <div class=\"btn-group btn-group-xs\"> <button type=\"button\" class=\"btn btn-default\" ng-class=\"{disabled: 1==currentPage}\" ng-click=\"selectPage(1)\"> <span class=\"glyphicon glyphicon-step-backward\"></span></button> <button type=\"button\" class=\"btn btn-default\" ng-class=\"{disabled: 1==currentPage}\" ng-click=\"selectPage(currentPage-1)\"> <span class=\"glyphicon glyphicon-chevron-left\"></span></button> <button type=\"button\" class=\"btn btn-default\" ng-repeat=\"page in pages\" ng-class=\"{active: page==currentPage}\" ng-click=\"selectPage(page)\"> {{page}} </button> <button type=\"button\" class=\"btn btn-default\" ng-class=\"{disabled: numPages==currentPage}\" ng-click=\"selectPage(currentPage+1)\"> <span class=\"glyphicon glyphicon-chevron-right\"></span></button> <button type=\"button\" class=\"btn btn-default\" ng-class=\"{disabled: numPages==currentPage}\" ng-click=\"selectPage(numPages)\"> <span class=\"glyphicon glyphicon-step-forward\"></span></button> </div> </div>");
$templateCache.put("sortable-table/sortable-table.html","<table class=\"table table-striped table-condensed\" st-table=\"records_\" st-safe-src=\"records\"> <caption ng-if=\"caption\" ng-bind=\"caption\"></caption> <thead> <tr> <th ng-repeat=\"col in columns track by $index\" ng-class=\"stylingFn(col)\" ng-attr-st-sort=\"{{col.sortKey}}\" st-sort-default=\"{{col.defaultSort}}\">{{col.name}} <help ng-if=\"col.hasOwnProperty(\'help\')\" text=\"{{col.help}}\"></help> </th> </tr> <tr ng-if=\"searchable\"> <th colspan=\"{{columns.length}}\"> <input type=\"text\" st-search placeholder=\"{{searchable}}\"> </th> </tr> </thead> <tbody> <tr ng-repeat=\"record in records_\"> <td ng-repeat=\"col in columns track by $index\" ng-class=\"stylingFn(col)\"> <div ng-switch=\"isArray(col.key)\"> <div ng-switch-when=\"true\" ng-repeat=\"childKey in col.key track by $index\"> <property value-bind=\"record[childKey]\" renderer=\"{{col.renderer[$index]}}\"></property> </div> <div ng-switch-default> <property value-bind=\"record[col.key]\" renderer=\"{{col.renderer}}\"></property> </div> </div> </td> </tr> <tr ng-if=\"records_.length===0\"> <td colspan=\"{{columns.length}}\" class=\"text-center\"> <span class=\"small\">No data found</span> </td> </tr> </tbody> <tfoot ng-if=\"records_.length>0\"> <tr> <td colspan=\"{{columns.length}}\"> <div class=\"pull-left\"> Total: <span ng-bind=\"records_.length\"></span> </div> <div class=\"pull-right\" st-pagination st-items-by-page=\"pagination\" st-template=\"sortable-table/sortable-table-pagination.html\"></div> </td> </tr> </tfoot> </table>");
$templateCache.put("tabset/tabset.html","<ul class=\"nav nav-tabs nav-tabs-underlined\"> <li ng-repeat=\"tab in tabs\" ng-class=\"{active:tab.selected}\"> <a href=\"\" ng-click=\"selectTab(tab)\" ng-bind=\"tab.heading\"></a> </li> </ul> <div class=\"tab-content\" ng-transclude></div>");}]);
angular.module('dashing.charts-comp', [
  'dashing.charts',
  'dashing.metrics'
])
  .directive('sparklineChartMetricsTop', function() {
    return {
      templateUrl: 'charts/sparkline-chart-metrics-top.html',
      restrict: 'E',
      scope: {
        caption: '@',
        help: '@',
        current: '@',
        unit: '@',
        options: '=optionsBind',
        data: '=datasourceBind'
      }
    };
  })
  .directive('sparklineChartMetricsLeft', function() {
    return {
      templateUrl: 'charts/sparkline-chart-metrics-left.html',
      restrict: 'E',
      scope: {
        caption: '@',
        help: '@',
        current: '@',
        unit: '@',
        smallText: '@',
        options: '=optionsBind',
        data: '=datasourceBind',
        metricsStyleFix: '@'
      }
    };
  })
;
angular.module('dashing.charts', [
  'dashing.metrics'
])
  .directive('echart', function() {
    return {
      restrict: 'A',
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
        chart.setOption(options, true);
        function ensureArray(obj) {
          return Array.isArray(obj) ? obj : [obj];
        }
        scope.$watch('data', function(data) {
          if (data) {
            var dataGrow = !options.xAxisDataNum ||
              chart.getOption().xAxis[0].data.length < options.xAxisDataNum;
            var array = [];
            angular.forEach(ensureArray(data), function(datum) {
              angular.forEach(ensureArray(datum.y), function(value, i) {
                var params = [i, value, false, dataGrow];
                if (i === 0) {
                  params.push(datum.x);
                }
                array.push(params);
              });
            });
            chart.addData(array);
          }
        });
      }
    };
  })
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
            type: args.axisPointer.type || 'line',
            lineStyle: {color: args.color, width: 3, type: 'dotted'}
          };
        }
        return result;
      },
      makeDataSeries: function(args) {
        args.type = args.type || 'line';
        return angular.merge(args, {
          smooth: true,
          itemStyle: {
            normal: {
              areaStyle: {type: 'default', color: args.colors.area},
              lineStyle: {color: args.colors.line, width: 3}
            },
            emphasis: {color: args.colors.line}
          }
        });
      },
      colorSet: function(i) {
        switch (i % 2) {
          case 1:
            return {
              line: 'rgb(110,119,215)',
              grid: 'rgba(110,119,215,.2)',
              area: 'rgb(129,242,250)'
            };
        }
        return {
          line: 'rgb(0,119,215)',
          grid: 'rgba(0,119,215,.2)',
          area: 'rgb(229,242,250)'
        };
      }
    };
  })
  .directive('sparklineChart', function() {
    return {
      template: '<div echart options="echartOptions" data="data"></div>',
      restrict: 'E',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = $scope.options;
        var colors = $echarts.colorSet(0);
        $scope.echartOptions = {
          height: use.height, width: use.width,
          tooltip: $echarts.tooltip({
            color: colors.grid,
            axisPointer: {type: 'none'},
            formatter: use.tooltipFormatter ? function(params) {
              return use.tooltipFormatter(params[0]);
            } : undefined
          }),
          dataZoom: {show: false},
          grid: {borderWidth: 0, x: 5, y: 5, x2: 5, y2: 0},
          xAxis: [{
            boundaryGap: false,
            axisLabel: false,
            splitLine: false,
            data: $scope.data.map(function(item) {
              return item.x;
            })
          }],
          yAxis: [{show: false}],
          xAxisDataNum: use.maxDataNum,
          series: [$echarts.makeDataSeries({
            colors: colors, name: '1',
            data: $scope.data.map(function(item) {
              return item.y;
            })
          })]
        };
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
angular.module('dashing.property-table', [])
  .directive('propertyTable', function () {
    return {
      templateUrl: 'property-table/property-table.html',
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
angular.module('dashing.sortable-table', [
  'smart-table'
])
  .directive('sortableTable', function() {
    return {
      templateUrl: 'sortable-table/sortable-table.html',
      restrict: 'E',
      scope: {
        caption: '@',
        pagination: '@',
        searchable: '@',
        columns: '=columnsBind',
        records: '=recordsBind'
      },
      controller: ['$scope', function($scope) {
        $scope.stylingFn = function(col) {
          return col.style +
            (['Number'].indexOf(col.renderer) !== -1 ? ' text-right' : '');
        };
                $scope.isArray = angular.isArray;
      }]
    };
  })
    .config(['stConfig', function(stConfig) {
    stConfig.sort.skipNatural = true;
  }])
;
angular.module('dashing.state', [])
  .directive('state', function() {
    return {
      template: '<span ng-class="stylingFn(condition)" class="label" ng-bind="text"></span>',
      restrict: 'E',
      scope: {
        condition: '@',
        text: '@'
      },
      controller: ['$scope', function($scope) {
        $scope.stylingFn = function(condition) {
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
        };
      }]
    };
  })
  .directive('indicator', function() {
    return {
      template: '<small ng-style="{color:colorFn(condition)}" class="glyphicon glyphicon-stop" ng-attr-bs-tooltip="text"></small>',
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