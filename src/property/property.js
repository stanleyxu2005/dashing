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
            switch ($scope.renderer) {
              case 'Link':
                if (!value.href) {
                  value.href = value.text;
                }
                break;

              case 'Button':
                if (value.href && !value.click) {
                  value.click = function() {
                    location.href = value.href;
                  };
                }
                break;
            }

            if (angular.isObject(value)) {
              if (value.hasOwnProperty('value')) {
                // `value.value` will assign `$scope.value`, which will trigger watch notification again.
                console.error({message: 'error', object: value});
              }
              angular.merge($scope, value);
            }
          }
        });
      }]
    };
  })
;