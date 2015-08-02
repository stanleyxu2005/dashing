/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.forms.searchbox', [
])
/**
 * A search box with a search icon on the right side.
 *
 * @example
 *  <searchbox ng-model="search" placeholder="Anything to search..."></searchbox>
 */
  .directive('searchbox', function() {
    'use strict';
    return {
      templateUrl: 'forms/searchbox.html',
      restrict: 'E',
      scope: {
        placeholder: '@',
        ngModel: '='
      }
    };
  })
;