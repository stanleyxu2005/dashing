/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.property', [])
/**
 * A magic widget to render property as a duration, state, progressbar, etc.
 *
 * @example
 *  <property value-bind="valueVariable" renderer="Duration"></property>
 */
  .directive('property', function() {
    'use strict';
    return {
      templateUrl: 'property/property.html',
      restrict: 'E',
      replace: false,
      scope: {
        value: '=valueBind',
        renderer: '@'
      },
      controller: ['$scope', function($scope) {
        $scope.$watch('value', function(value) {
          if (value) {
            switch ($scope.renderer) {
              case 'ProgressBar':
                $scope.current = value.current;
                $scope.max = value.max;
                break;
              case 'Link':
                $scope.href = value.href;
                $scope.text = value.text || value.href;
                $scope.class = value.class;
                $scope.tooltip = value.tooltip;
                break;
              case 'State':
                $scope.text = value.text;
                $scope.condition = value.condition;
                break;
              case 'Indicator':
                $scope.text = value.text;
                $scope.condition = value.condition;
                break;
            }
          }
        });
      }]
    };
  })
/** Converts milliseconds to human readable duration representation. */
  .filter('duration', function() {
    'use strict';
    return function(millis) {
      var x = parseInt(millis, 10);
      if (isNaN(x)) {
        return millis;
      }

      var units = [
        {label: "ms", mod: 1000},
        {label: "secs", mod: 60},
        {label: "mins", mod: 60},
        {label: "hours", mod: 24},
        {label: "days", mod: 7},
        {label: "weeks", mod: 52}
      ];
      var duration = [];

      for (var i = 0; i < units.length; i++) {
        var unit = units[i];
        var t = x % unit.mod;
        if (t !== 0) {
          duration.unshift({label: unit.label, value: t});
        }
        x = (x - t) / unit.mod;
      }

      duration = duration.slice(0, 2);
      if (duration.length > 1 && duration[1].label === "ms") {
        duration = [duration[0]];
      }
      return duration.map(function(unit) {
        return unit.value + " " + unit.label;
      }).join(" and ");
    };
  })
;