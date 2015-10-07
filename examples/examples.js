/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */

angular.module('examples', [
  'ui.router',
  'dashing'
])

  .config(['$urlRouterProvider',
    function($urlRouterProvider) {
      'use strict';
      $urlRouterProvider
        .when('', '/')
        .when('/', '/charts/line');
    }])
;