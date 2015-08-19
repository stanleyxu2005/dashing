/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts.ring', [
  'dashing.charts.echarts'
])
/**
 * Ring (pie) chart control.
 *
 * The width of the chart will be calculated by the number bars. If its too narrow to show all bars,
 * the chart will have a data zoom control to scroll the value bars.
 *
 * @example
 *   <ring-pie-chart
 *     options-bind="::chartOptions"
 *     datasource-bind="chartData">
 *   </ring-pie-chart>
 *
 * @param options-bind - the option object, which the following elements:
 * {
 *   height: string // the css height of the chart
 *   showUsage: boolean // show current usage in the middle of the ring (default: false)
 *   color: string // optional to override bar color
 * }
 * @param datasource-bind - array of data objects
 *   every data object is {x: time|string, y: [number]}
 */
  .directive('ringPieChart', function() {
    'use strict';

    return {
      restrict: 'E',
      template: '<echart options="::echartOptions"></echart>',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      link: function(scope) {
        var echartScope = scope.$$childHead;
        scope.$watch('data', function(data) {
          echartScope.setOptions({
            series: [{
              data: [
                {value: data.available.value},
                {value: data.used.value}
              ]
            }]
          });
        });
      },
      controller: ['$scope', '$echarts', function($scope, $echarts) {
        var use = angular.merge({
          color: 'rgb(35,183,229)',
          showUsage: true
        }, $scope.options);

        var data = use.data || $scope.data;
        if (!data) {
          console.warn('Need data to render the ring pie chart');
        }
        var colors = $echarts.buildColorStates(use.color);
        var padding = 8;
        var outerRadius = (parseInt(use.height) - 30 - padding * 2) / 2;
        var itemStyleBase = {
          normal: {
            color: 'rgb(232,239,240)',
            label: {show: true, position: 'center'},
            labelLine: {show: false}
          }
        };

        var options = {
          height: use.height,
          width: use.width,
          grid: {borderWidth: 0},
          xAxis: [{show: false, data: [0]}],
          legend: {
            selectedMode: false,
            itemGap: 20,
            y: 'bottom',
            data: [data.used.label, data.available.label].map(function(label) {
              return {name: label, textStyle: {fontWeight: 500}, icon: 'a'};
            })
          },
          series: [{
            type: 'pie',
            center: ['50%', outerRadius + padding],
            radius: [Math.floor(outerRadius * 0.78), outerRadius],
            data: [{
              name: data.available.label,
              value: data.available.value,
              itemStyle: itemStyleBase
            }, {
              name: data.used.label,
              value: data.used.value,
              itemStyle: angular.merge({}, itemStyleBase, {
                normal: {color: colors.line}
              })
            }]
          }]
        };

        if (use.showUsage) {
          options.series[0].itemStyle = {
            normal: {
              label: {
                formatter: function() {
                  return $scope.data.used.value + ($scope.data.used.unit || '');
                },
                textStyle: {
                  color: '#111',
                  fontSize: 28,
                  fontWeight: 500,
                  baseline: 'middle'
                }
              }
            }
          };
        }
        $scope.echartOptions = options;
      }]
    };
  })
;