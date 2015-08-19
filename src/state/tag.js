/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.state.tag', [
  'dashing.util',
  'mgcrea.ngStrap.tooltip' // angular-strap
])
/**
 * A clickable bootstrap label indicates one of these states: good, concern, danger or unknown.
 *
 * @param condition good|concern|danger|unknown
 * @param text text to shown on the tag
 * @param href link to follow when click on the tag control (optional)
 * @param tooltip string (optional)
 *
 * @example
 *  <tag condition="good" text="Build passed"></tag>
 *  <tag href="/path/to/page" condition="concern" text="error" tooltip="Build failed"></tag>
 */
  .directive('tag', ['$util', function($util) {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'state/tag.html',
      scope: {
        href: '@',
        text: '@',
        tooltip: '@'
      },
      link: function(scope, elem, attrs) {
        if (!attrs.condition) {
          attrs.condition = '';
        }

        /** Condition will affect the color */
        attrs.$observe('condition', function(condition) {
          scope.labelColorClass = $util.conditionToBootstrapLabelClass(condition);
        });
        /** Tooltip text will affect the cursor type */
        attrs.$observe('tooltip', function(tooltip) {
          if (!scope.href) {
            scope.cursorStyle = tooltip ? 'pointer' : 'default';
          }
        });
      }
    };
  }])
;