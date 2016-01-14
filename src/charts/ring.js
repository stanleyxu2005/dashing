/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts.ring', [
  'dashing.charts.adapter.echarts',
  'dashing.charts.look_and_feel'
])
/**
 * Ring (pie) chart control.
 *
 * The width of the chart will be calculated by the number bars. If its too narrow to show all bars,
 * the chart will have a data zoom control to scroll the value bars.
 *
 * @param options-bind object
 * {
 *   height: string // the css height of the chart
 *   color: string // optional to override ring color
 *
 *   title: string // optional to show a title right to the ring. The total value and unit will be show as well.
 *   thickness: number // optional to override the ratio of inner/outer ring radius (default: 0.25)
 * }
 * @param datasource-bind - object
 * {
     used: {value: 64, label: 'Allocated', unit: 'GB'},
     available: {value: 256 - 64, label: 'Available'}
   }
 *
 * @example
 *   <ring-chart
 *     options-bind="options"
 *     datasource-bind="dataArray">
 *   </ring-chart>
 */
  .directive('ringChart', function() {
    'use strict';

    return {
      restrict: 'E',
      template: '<echart options="::initOptions" api="api"></echart>',
      scope: {
        options: '=optionsBind',
        data: '=datasourceBind'
      },
      link: function(scope) {
        scope.$watch('data', function(data) {
          scope.api.updateOption({
            series: [{
              data: [
                {value: data.available.value},
                {value: data.used.value}
              ]
            }]
          });
        });
      },
      controller: ['$scope', '$element', 'dashing.charts.look_and_feel',
        function($scope, $element, lookAndFeel) {
          var use = angular.merge({
            color: lookAndFeel.ringChartColorRecommendation(1)[0],
            thickness: 0.25
          }, $scope.options);

          if (!angular.isNumber(use.thickness) || use.thickness > 1 || use.thickness <= 0) {
            console.warn({message: 'Ignored invalid thickness value', value: use.thickness});
            use.thickness = 0.25;
          }

          var data = use.data || $scope.data;
          if (!data) {
            console.warn('Need data to render the ring chart.');
          }
          var colors = lookAndFeel.buildColorStates(use.color);
          var padding = 8;
          var outerRadius = (parseInt(use.height) - 30 - padding * 2) / 2;
          var innerRadius = Math.floor(outerRadius * (1 - use.thickness));
          var innerTextFontSize = Math.floor(28 * innerRadius / 39);
          if (innerTextFontSize < 12) {
            console.warn('Please increase the height to get a better visual experience.');
          }
          var itemStyleBase = {
            normal: {
              color: 'rgb(232,239,240)',
              label: {show: true, position: 'center'},
              labelLine: false
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
              radius: [innerRadius, outerRadius],
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

          options.series[0].itemStyle = {
            normal: {
              label: {
                formatter: function() {
                  return Math.round($scope.data.used.value * 100 /
                      ($scope.data.used.value + $scope.data.available.value)) + '%';
                },
                textStyle: {
                  color: '#111',
                  fontSize: Math.floor(28 * innerRadius / 39),
                  fontWeight: 500,
                  baseline: 'middle'
                }
              }
            }
          };

          if (use.title) {
            options.series[0].center[0] = outerRadius + padding;
            options.legend.x = padding;
            options.title = {
              text: use.title,
              x: (outerRadius + padding) * 2 + padding + 4,
              y: outerRadius + padding + 4,
              textStyle: {
                fontSize: 12,
                fontWeight: 500,
                color: '#666'
              }
            };

            // As Echarts' title does not support, we insert a real HTML element.
            var left = options.title.x + 14;
            var top = options.title.y - 48;
            var total = $scope.data.used.value + $scope.data.available.value;
            var unit = $scope.data.used.unit;
            var unselectable =
              '-webkit-touch-callout: none;' +
              '-webkit-user-select: none;' +
              '-khtml-user-select: none;' +
              '-moz-user-select: none;' +
              '-ms-user-select: none;' +
              'user-select: none;';
            angular.element($element[0]).append([
              '<div style="position: absolute; left: ' + left + 'px; top: ' + top + 'px">',
              '<p style="cursor: default; ' + unselectable + '">',
              '<span style="font-size: 40px; font-weight: 500">' + total + '</span>',
              (unit ? ('<span style="font-size: 15px; font-weight: 700">' + unit + '</span>') : ''),
              '</p>',
              '</div>'
            ].join(' '));
          }

          $scope.initOptions = options;
        }]
    };
  })
;