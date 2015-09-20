/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */

angular.module('examples')

  .config(['$stateProvider',
    function($stateProvider) {
      'use strict';
      $stateProvider
        .state('temp', {
          url: '/charts/temp',
          templateUrl: 'views/charts/temp.html',
          controller: 'TempCtrl'
        });
    }])

  .controller('TempCtrl', ['$scope', '$interval', '$echarts',
    function($scope, $interval, $echarts) {
      var timeLabel = moment().format('HH:mm:ss');
      var maxChartDataPoints = 30;

      var offset = 0;
      $scope.lineChartOption = {
        height: '168px',
        xAxisTypeIsTime: true,
        stacked: false,
        yAxisLabelFormatter: $echarts.axisLabelFormatter('B'),
        data: _.range(maxChartDataPoints).map(function(i) {
          offset += 100;
          return {
            x: moment().seconds(offset).toDate(),//.format('HH:mm:ss'),
            y: [Math.random() * 100000, Math.random() * 120000]
          };
        }),
        visibleDataPointsNum: maxChartDataPoints + 2,
        seriesNames: ['Read', 'Write']
      };

      $scope.lineChartOption2 = {
        height: '168px',
        xAxisTypeIsTime: false,
        yAxisLabelFormatter: $echarts.axisLabelFormatter('B'),
        data: _.range(maxChartDataPoints).map(function(i) {
          return {
            x: moment().seconds(i * 60).format('HH:mm:ss'),
            y: [Math.random() * 100000, Math.random() * 120000]
          };
        }),
        visibleDataPointsNum: maxChartDataPoints,
        seriesNames: ['Read', 'Write']
      };

      $scope.lineChartOption4 = angular.copy($scope.lineChartOption2);
      $scope.lineChartOption4.seriesStacked = false;

      $interval(function() {
        offset += 100;
        var y = [Math.random() * 1000000, Math.random() * 1200000];
        $scope.lineChartData = [{
          x: moment().seconds(offset).toDate(),
          y: y
        }];
        $scope.lineChartData2 = [{
          x: moment().seconds(offset).format('HH:mm:ss'),
          y: y
        }];
        $scope.lineChartData3 = [{
          x: moment().seconds(offset).unix() * 1000,
          y: y
        }];
      }, 2000);
    }])
;