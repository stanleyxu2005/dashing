/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.state.indicator', [
  'dashing.util',
  'mgcrea.ngStrap.tooltip' // angular-strap
])
/**
 * A small square icon that indicates one of these states: good, concern, danger or whatever.
 *
 * @param condition good|concern|danger or fallback to default
 * @param tooltip string (optional)
 *
 * @example
 *  <indicator condition="good"></indicator>
 *  <indicator condition="good" tooltip="Build passed"></indicator>
 */
  .directive('indicator', ['$util', function($util) {
    'use strict';
    return {
      restrict: 'E',
      templateUrl: 'state/indicator.html',
      scope: {
        tooltip: '@'
      },
      link: function(scope, elem, attrs) {
        /** Condition will affect the color */
        attrs.$observe('condition', function(condition) {
          scope.colorStyle = $util.conditionToColor(condition);
        });
        /** Tooltip text will affect the cursor type */
        attrs.$observe('tooltip', function(tooltip) {
          scope.cursorStyle = tooltip ? 'pointer' : 'default';
        });
      }
    };
  }])
;