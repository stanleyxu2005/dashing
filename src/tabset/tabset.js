/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.tabset', [])
/**
 * Similar to Google's tab control.
 *
 * @example
 *  <tabset switch-to="switchTab">
 *    <tab ng-repeat="tab in tabs track by $index"
 *      heading="{{tab.heading}}"
 *      template="{{tab.templateUrl}}
 *      controller="{{tab.controller}}"></tab>
 *  </tabset>
 *
 *  In script:
 *    var directiveScope = angular.element(tabsetElem).scope();
 *    directiveScope.selectTab(2);
 */
  .directive('tabset', [function() {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'tabset/tabset.html',
      transclude: true,
      scope: true, // in order to expose the method `selectTab()`
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

/** Directive of tab that is associated with tabs */
  .directive('tab', ['$http', '$controller', '$compile',
    function($http, $controller, $compile) {
      'use strict';

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