/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */

angular.module('examples')

  .controller('LayoutCtrl', ['$scope', function($scope) {
    'use strict';

    var minimalWidth = 960;

    $scope.windowInnerWidth = function() {
      return window.innerWidth;
    };

    $scope.$watch($scope.windowInnerWidth, function(width) {
      if ($scope.open && width < minimalWidth) {
        $scope.open = false;
      } else if (!$scope.open && width > minimalWidth) {
        $scope.open = true;
      }
    });

    $scope.toggleSidebar = function() {
      $scope.open = !$scope.open;
    };

    window.onresize = function() {
      $scope.$apply();
    };
  }])
;