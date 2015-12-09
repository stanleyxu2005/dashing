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
        placement: '@'
      },
      link: function(scope, elem, attrs) {
        attrs.$observe('type', function(type) {
          switch (type) {
            case 'info':
              scope.fontClass = 'glyphicon glyphicon-info-sign';
              break;
            case 'warning':
              scope.fontClass = 'glyphicon glyphicon-warning-sign';
              scope.colorClassSuffix = '-warning';
              break;
            case 'question':
            default:
              scope.fontClass = 'glyphicon glyphicon-question-sign';
              break;
          }
        });
      }
    };
  })
;