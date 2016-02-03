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
 * @param condition enum(good|concern|danger)
 *   specify the background color according to condition
 *   fallback to gray, if condition is not specified or recognized
 * @param tooltip string (optional)
 * @param shape enum(stripe) (optional)
 *   "stripe" means a full filled bar (width=8px)
 *   fallback to a small square icon, if shape is not specified or recognized
 *
 * @example
 *  <indicator condition="good"></indicator>
 *  <indicator condition="good" tooltip="Build passed"></indicator>
 *  <indicator condition="good" shape="stripe"></indicator>
 */
  .directive('indicator', ['dashing.util', function(util) {
    'use strict';
    return {
      restrict: 'E',
      templateUrl: 'state/indicator.html',
      scope: {
        tooltip: '@',
        shape: '@'
      },
      link: function(scope, elem, attrs) {
        if (!attrs.condition) {
          attrs.condition = '';
        }

        /** Condition will affect the color */
        attrs.$observe('condition', function(condition) {
          scope.colorStyle = util.color.conditionToColor(condition);
        });
        /** Tooltip text will affect the cursor type */
        attrs.$observe('tooltip', function(tooltip) {
          scope.cursorStyle = tooltip ? 'pointer' : 'default';
        });
      }
    };
  }])
;