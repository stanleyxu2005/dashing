/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.forms.searchbox', [
])
/**
 * A (Bootstrap style based) search box with a search icon on the right side.
 *
 * @example
 *  <searchbox ng-model="search" placeholder="Search Anything"></searchbox>
 */
  .directive('searchbox', function() {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'forms/searchbox.html',
      scope: {
        placeholder: '@',
        ngModel: '='
      }
    };
  })
;