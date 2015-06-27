/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.progressbar', [])
/**
 * A combination of labels and a bootstrap progress bar. The color of the progress bar is
 * determined by the progress value.
 *
 * @example
 *  <progressbar current="50" max="100"/>
 */
  .directive('progressbar', function() {
    'use strict';
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
        // todo: externalize as a color attribute
        $scope.colorFn = function(usage) {
          return usage < 50 ? 'blue' : (usage < 75 ? 'yellow' : 'red');
        };
      }]
    };
  })
;