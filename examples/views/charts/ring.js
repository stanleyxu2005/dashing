/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */

angular.module('examples')

  .config(['$stateProvider',
    function($stateProvider) {
      'use strict';

      $stateProvider
        .state('ring-chart', {
          url: '/charts/ring',
          templateUrl: 'views/charts/ring.html',
          controller: 'RingChartCtrl'
        });
    }])

  .controller('RingChartCtrl', ['$scope', '$interval',
    function($scope, $interval) {
      'use strict';

      $scope.ringChartOption = {
        height: '150px'
      };
      $scope.ringChartOption2 = {
        height: '200px',
        title: 'TOTAL MEMORY',
        thickness: 0.2
      };
      $scope.ringChartData = {
        used: {value: 32, label: 'Allocated', unit: 'GB'},
        available: {value: 96 + 128, label: 'Available'}
      };
      $interval(function() {
        var used = Math.random() * 50;
        $scope.ringChartData = {
          used: {value: used},
          available: {value: 100 - used}
        };
      }, 2000);
    }])
;