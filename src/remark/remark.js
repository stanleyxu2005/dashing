/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.remark', [
  'mgcrea.ngStrap.tooltip' // angular-strap
])
/**
 * A question mark icon with a tooltip.
 *
 * @param tooltip string
 * @param type enum(question|warning) (default=question)
 * @param placement enum(top|left|right|bottom) (default=top)
 * @param trigger set(hover|focus|click) (default=[hover, focus])
 *
 * @example
 *  <remark tooltip="This is a tooltip"></remark>
 */
  .directive('remark', function() {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'remark/remark.html',
      scope: {
        tooltip: '@',
        placement: '@',
        type: '@',
        trigger: '@'
      },
      link: function(scope) {
        scope.$watch('type', function(type) {
          switch (type) {
            case 'info':
              scope.styleClass = 'remark-icon octicon octicon-info';
              break;
            case 'warning':
              scope.styleClass = 'remark-icon-warning octicon octicon-alert';
              break;
            default:
              scope.styleClass = 'remark-icon octicon octicon-question';
              break;
          }
        });
      }
    };
  })
;