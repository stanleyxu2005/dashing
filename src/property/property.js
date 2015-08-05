/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.property', [
  'mgcrea.ngStrap.tooltip' // angular-strap
])
/**
 * A runtime determined auto property widget, which can be rendered as progress bar,
 * button, time duration, state indicator, colored tag, etc.
 *
 * @example
 *  <property value-bind="tagArgs" renderer="Tag"></property>
 */
  .directive('property', function() {
    'use strict';

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
            // Note that do NOTE modify `$scope.value`, otherwise it will trigger watch
            // notification again.
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
;