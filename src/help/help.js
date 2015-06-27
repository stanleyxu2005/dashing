/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.help', [
  'mgcrea.ngStrap.tooltip' // angular-strap
])
/**
 * A question mark icon with a tooltip.
 *
 * @example
 *  <help text="This is a tooltip"></help>
 */
  .directive('help', function() {
    'use strict';
    return {
      template: '<span class="glyphicon glyphicon-question-sign help-icon" bs-tooltip="text"></span>',
      restrict: 'E',
      scope: {
        text: '@'
      }
    };
  })
;