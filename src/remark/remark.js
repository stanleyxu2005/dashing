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
 * @param type question|warning (default=question)
 * @param tooltip string (optional)
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
        tooltip: '@'
      },
      link: function(scope, elem, attrs) {
        switch (attrs.type) {
          case 'info':
            scope.fontClass = 'glyphicon glyphicon-info-sign';
            break;
          case 'warning':
            scope.fontClass = 'glyphicon glyphicon-exclamation-sign';
            break;
          //case 'question':
          default:
            scope.fontClass = 'glyphicon glyphicon-question-sign';
            break;
        }
      }
    };
  })
;