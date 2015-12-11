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
        type: '@'
      },
      link: function(scope) {
        scope.$watch('type', function(type) {
          switch (type) {
            case 'info':
              scope.styleClass = 'glyphicon glyphicon-info-sign remark-icon';
              break;
            case 'warning':
              scope.styleClass = 'glyphicon glyphicon-warning-sign remark-icon-warning';
              break;
            default:
              scope.styleClass = 'glyphicon glyphicon-question-sign remark-icon';
              break;
          }
        });
      }
    };
  })
;