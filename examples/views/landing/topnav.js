/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */

angular.module('examples')

  .directive('topnav', function() {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'views/landing/topnav.html',
      replace: true
    };
  })
;