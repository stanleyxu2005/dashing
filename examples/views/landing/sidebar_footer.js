/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */

angular.module('examples')

  .directive('sidebarFooter', function() {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'views/landing/sidebar_footer.html',
      replace: true
    };
  })
;