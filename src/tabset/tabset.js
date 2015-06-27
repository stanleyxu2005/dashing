/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.tabset', [])
/**
 * Similar to Google's tab control.
 *
 * @example
 *  <tabset>
 *    <tab heading="tab 1" template="path/to/tab1.html" controller="tab1Ctrl"></tab>
 *    <tab heading="tab 2" template="path/to/tab2.html" controller="tab2Ctrl"></tab>
 *  </tabset>
 */
  .directive('tabset', [function() {
    'use strict';
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

/** Directive of tab that is associated with tabs */
  .directive('tab', ['$http', '$controller', '$compile',
    function($http, $controller, $compile) {
      'use strict';
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