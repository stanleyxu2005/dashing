/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */

angular.module('examples')

  .config(['$stateProvider',
    function($stateProvider) {
      'use strict';

      $stateProvider
        .state('line-chart', {
          url: '/charts/line',
          templateUrl: 'views/charts/line.html',
          controller: 'LineChartCtrl'
        });
    }])

  .controller('LineChartCtrl', ['$scope', '$interval', '$echarts',
    function($scope, $interval, $echarts) {
      'use strict';

      var maxChartDataPoints = 30;
      var seriesCount = 5;
      var i = 0;
      $scope.value = 0;

      function nextData() {
        i++;
        $scope.value = (Math.random() * 100000).toFixed(1);
        return {
          x: moment().minute(i * 5).format('HH:mm'),
          y: _.times(seriesCount, function() {
            return Math.random() * 100000;
          })
        };
      }

      $scope.lineChartOption = {
        height: '168px',
        //xAxisType: 'time',
        yAxisLabelFormatter: $echarts.axisLabelFormatter('B'),
        data: _.range(maxChartDataPoints).map(function() {
          return nextData();
        }),
        visibleDataPointsNum: maxChartDataPoints,
        seriesNames: ['Disk Read', 'Disk Write']
      };
      $scope.lineChartOption2 = angular.extend({}, $scope.lineChartOption, {
        seriesStacked: false
      });
      $scope.lineChartOption3 = angular.extend({}, $scope.lineChartOption, {
        seriesNames: _.times(seriesCount, function(i) {
          return 'Series ' + (i+1);
        })
      });
      $scope.lineChartOption4 = angular.extend({}, $scope.lineChartOption, {
        height: '108px'
      });

      $interval(function() {
        $scope.lineChartData = nextData();
      }, 5000);
    }])
;