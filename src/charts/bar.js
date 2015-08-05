/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts.bar', [
  'dashing.charts.echarts'
])
/**
 * Bar chart control.
 */
  .directive('barChart', function() {
    'use strict';
    return {
      restrict: 'E',
      template: '<echart options="::echartOptions"></echart>',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      link: function(scope, elem) {
        var echartElem = elem.find('div')[0];
        var echartScope = angular.element(echartElem).isolateScope();

        // todo: watch can be expensive. we should find a simple way to expose the addDataPoint() method.
        scope.$watch('data', function(data) {
          echartScope.addDataPoints(data);
        });
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = $scope.options;
        var data = $scope.data;
        var colors = $echarts.colorPalette(0)[0];
        $scope.echartOptions = {
          height: use.height, width: use.width,
          tooltip: $echarts.tooltip({
            color: colors.grid,
            trigger: 'item'
          }),
          grid: {borderWidth: 0, x: 45, y: 5, x2: 5, y2: 42},
          xAxis: [{
            axisLabel: {show: false},
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false},
            data: data.map(function(item) {
              return item.x;
            })
          }],
          yAxis: [{show: false}],
          dataZoom: {show: true, handleColor: 'rgb(188,188,188)', fillerColor: 'rgba(188,188,188,.15)'},
          series: [$echarts.makeDataSeries({
            colors: colors,
            type: 'bar', barWidth: 7, barMaxWidth: 7, barGap: 2, barCategoryGap: 2, smooth: false,
            data: data.map(function(item) {
              return item.y;
            })
          })],
          // own properties
          xAxisDataNum: use.maxDataNum
        };
      }]
    };
  })
;