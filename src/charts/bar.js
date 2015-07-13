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
  .directive('barChart', [function() {
    'use strict';
    return {
      template: '<echart options="echartOptions" data="data"></echart>',
      restrict: 'E',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
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
          xAxisDataNum: use.maxDataNum,
          dataZoom: {show: true, handleColor: 'rgb(188,188,188)', fillerColor: 'rgba(188,188,188,.15)'},
          series: [$echarts.makeDataSeries({
            colors: colors,
            type: 'bar', barWidth: 7, barMaxWidth: 7, barGap: 2, barCategoryGap: 2, smooth:false,
            data: data.map(function(item) {
              return item.y;
            })
          })]
        };
      }]
    };
  }])
;