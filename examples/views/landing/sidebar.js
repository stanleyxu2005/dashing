/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */

angular.module('examples')

  .directive('sidebar', function() {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'views/landing/sidebar.html',
      replace: true
    };
  })
;