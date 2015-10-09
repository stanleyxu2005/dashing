/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.progressbar', [])
/**
 * A combination of labels and a bootstrap progress bar. The color of the progress bar is
 * determined by the progress value.
 *
 * @param current number
 * @param max number
 * @param color-mapper-fn function (optional)
 *   function that provides particular color name for a given value
 *
 * @example
 *  <progressbar current="50" max="100" color-mapper-fn="customColorMapperFn"></progressbar>
 */
  .directive('progressbar', function() {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'progressbar/progressbar.html',
      scope: {
        current: '@',
        max: '@',
        colorMapperFn: '='
      },
      link: function(scope, elem, attrs) {
        attrs.$observe('current', function(current) {
          updateUsageAndClass(Number(current), Number(attrs.max));
        });
        attrs.$observe('max', function(max) {
          updateUsageAndClass(Number(attrs.current), Number(max));
        });

        function updateUsageAndClass(current, max) {
          scope.usage = max > 0 ? Math.round(current * 100 / max) : -1;
          scope.usageClass = (scope.colorMapperFn ?
            scope.colorMapperFn : defaultColorMapperFn)(scope.usage);
        }

        function defaultColorMapperFn(usage) {
          return 'progress-bar-' +
            (usage < 50 ? 'info' : (usage < 75 ? 'warning' : 'danger'));
        }
      }
    };
  })
;