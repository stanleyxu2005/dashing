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
 *  <progressbar current="50" max="100"></progressbar>
 */
  .directive('progressbar', function() {
    'use strict';

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
          // todo: provide a range array for colors
          scope.usageClass = 'progress-bar-' +
            (scope.usage < 50 ? 'info' : (scope.usage < 75 ? 'warning' : 'danger'));
        }
      }
    };
  })
;