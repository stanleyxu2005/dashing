/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */

angular.module('examples')

  .controller('LayoutCtrl', ['$scope', function($scope) {
    'use strict';

    $scope.windowInnerWidth = function() {
      return window.innerWidth;
    };

    $scope.$watch($scope.windowInnerWidth, function(width) {
      $scope.toggle = true;
    });

    $scope.toggleSidebar = function() {
      $scope.toggle = !$scope.toggle;
    };

    window.onresize = function() {
      $scope.$apply();
    };
  }])
;