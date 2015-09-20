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

      $scope.lineChartOption = {
        height: '148px',
        //xAxisType: 'time',
        yAxisLabelFormatter: $echarts.axisLabelFormatter('B'),
        data: _.range(maxChartDataPoints).map(function(i) {
          return {
            x: moment().minute(-i * 20).format('HH:mm:ss') + ',' + i,
            y: [Math.random() * 100000, Math.random() * 120000]
          };
        }),
        visibleDataPointsNum: maxChartDataPoints * 2,
        seriesNames: ['Read', 'Write']
      };

      var i = 0;
      $interval(function() {
        $scope.lineChartData = {
          x: moment().minute(i * 20).format('HH:mm:ss') + ',' + i,
          y: [Math.random() * 100000, Math.random() * 120000]
        };
      }, 2000);
    }])
;