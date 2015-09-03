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
 *   <ring-chart
 *     options-bind="::chartOptions"
 *     datasource-bind="chartData">
 *   </ring-chart>
 *
 * @param options-bind - the option object, which the following elements:
 * {
 *   height: string // the css height of the chart
 *   textPosition: 'inner'|'right' // either show current usage inside the ring or show total value at right (default: inner)
 *   color: string // optional to override ring color
 * }
 * @param datasource-bind - array of data objects
 *   every data object is {x: time|string, y: [number]}
 */
  .directive('ringChart', function() {
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
          var chartControl = echartScope.getChartControl();
          chartControl.setOption({
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
          textPosition: 'inner'
        }, $scope.options);

        var data = use.data || $scope.data;
        if (!data) {
          console.warn('Need data to render the ring pie chart.');
        }
        var colors = $echarts.buildColorStates(use.color);
        var padding = 8;
        var outerRadius = (parseInt(use.height) - 30 - padding * 2) / 2;
        var itemStyleBase = {
          normal: {
            color: 'rgb(232,239,240)',
            label: {show: use.textPosition === 'inner', position: 'center'},
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
            itemWidth: 13,
            y: 'bottom',
            data: [data.used.label, data.available.label].map(function(label) {
              return {name: label, textStyle: {fontWeight: 500}, icon: 'a'};
            })
          },
          series: [{
            type: 'pie',
            center: ['50%', outerRadius + padding],
            radius: [Math.floor(outerRadius * 0.74), outerRadius],
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

        switch (use.textPosition) {
          case 'inner':
            options.series[0].itemStyle = {
              normal: {
                label: {
                  formatter: function() {
                    return Math.round($scope.data.used.value * 100 /
                        ($scope.data.used.value + $scope.data.available.value)) + '%';
                  },
                  textStyle: {
                    color: '#111',
                    fontSize: 28, // todo: auto-adjust font size?
                    fontWeight: 500,
                    baseline: 'middle'
                  }
                }
              }
            };
            break;
          case 'right':
            if (use.title) {
              options.series[0].center[0] = outerRadius + padding;
              options.legend.x = padding;
              options.title = {
                text: $scope.data.used.value + ($scope.data.used.unit || ''),
                subtext: use.title,
                itemGap: 11,
                x: (outerRadius + padding) * 2 + padding,
                y: outerRadius + padding - 40,
                textStyle: {
                  fontSize: 40,
                  fontWeight: 500
                },
                subtextStyle: {
                  fontSize: 14
                }
              };
            }
            break;
        }

        $scope.echartOptions = options;
      }]
    };
  })
;