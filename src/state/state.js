/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.state', [])
/**
 * A bootstrap label indicates one of these states: good, concern, danger or unknown.
 *
 * @param condition good|concern|danger|unknown
 * @example
 *  <state condition="good" text="running"></state>
 */
  .directive('state', function() {
    'use strict';
    return {
      template: '<span ng-class="stylingFn(condition)" class="label" ng-bind="text"></span>',
      restrict: 'E',
      scope: {
        condition: '@',
        text: '@'
      },
      controller: ['$scope', function($scope) {
        $scope.stylingFn = function(condition) {
          switch (condition) {
            case 'good':
              return 'label-success';
            case 'concern':
              return 'label-warning';
            case 'danger':
              return 'label-danger';
            default:
              return 'label-default';
          }
        };
      }]
    };
  })
/**
 * A small circle indicates one of these states: good, concern, danger or unknown.
 *
 * @param condition good|concern|danger|unknown
 * @example
 *  <indicator condition="good" text="running"></state>
 */
  .directive('indicator', function() {
    'use strict';
    return {
      template: '<small ng-style="{color:colorFn(condition)}" class="glyphicon glyphicon-stop" ng-attr-bs-tooltip="text"></small>',
      restrict: 'E',
      scope: {
        condition: '@',
        text: '@'
      },
      controller: ['$scope', function($scope) {
        $scope.colorFn = function(condition) {
          switch (condition) {
            case 'good':
              return '#5cb85c';
            case 'concern':
              return '#f0ad4e';
            case 'danger':
              return '#d9534f';
            default:
              return '#777';
          }
        };
      }]
    };
  })
;