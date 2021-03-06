/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.property', [
  'mgcrea.ngStrap.tooltip' // angular-strap
])
/**
 * A runtime determined auto property widget, which can be rendered as progress bar,
 * button, time duration, state indicator, colored tag, etc. Note that the directive
 * is created for internal usage.
 *
 * @param renderer enum(Button|Bytes|DateTime|Duration|Indicator|Link|Number|ProgressBar|Tag|') (default is text)
 * @param value-bind object
 *
 * @example
 *  <property renderer="Tag" value-bind="tagArgs"></property>
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
      controller: ['$scope', 'dsPropertyRenderer', function($scope, renderer) {
        if ($scope.renderer === renderer.BYTES) {
          console.warn('deprecated: should use renderer NUMBER instead');
          $scope.renderer = renderer.NUMBER;
        }

        $scope.$watch('value', function(value) {
          if (angular.isObject(value)) {
            switch ($scope.renderer) {
              case renderer.LINK:
                if (!value.href) {
                  $scope.href = value.text;
                }
                break;

              case renderer.BUTTON:
                if (value.href && !value.click) {
                  $scope.click = function() {
                    if (value.target) {
                      var win = window.open(value.href, value.target);
                      win.focus();
                    } else {
                      location.href = value.href;
                    }
                  };
                }
                break;
            }

            if (value.hasOwnProperty('value')) {
              // `value.value` will assign `$scope.value`, which will trigger watch notification again.
              console.warn({message: 'Ignore `value.value`, because it is a reversed field.', object: value});
              delete value.value;
            }
            // bind all value fields to scope.
            angular.merge($scope, value);
          }
          else if (angular.isNumber(value)) {
            if ($scope.renderer === renderer.NUMBER) {
              $scope.raw = value; // convert simple value to valid number value option
            }
          }
        });
      }]
    };
  })
/** Renderer constants */
  .constant('dsPropertyRenderer', {
    BUTTON: 'Button',
    BYTES: 'Bytes',
    DATETIME: 'DateTime',
    DURATION: 'Duration',
    INDICATOR: 'Indicator',
    LINK: 'Link',
    NUMBER: 'Number',
    NUMBER1: 'Number1',
    NUMBER2: 'Number2',
    PROGRESS_BAR: 'ProgressBar',
    TAG: 'Tag',
    TEXT: undefined /* default renderer */
  })
;