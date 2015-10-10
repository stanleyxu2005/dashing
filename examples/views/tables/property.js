/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */

angular.module('examples')

  .config(['$stateProvider',
    function($stateProvider) {
      'use strict';

      $stateProvider
        .state('property-table', {
          url: '/tables/property',
          templateUrl: 'views/tables/property.html',
          controller: 'PropertyTableControl'
        });
    }])

  .controller('PropertyTableControl', ['$scope', '$interval', '$propertyTableBuilder',
    function($scope, $interval, $ptb) {
      'use strict';

      $scope.propsVariable = [
        $ptb.number('Number').value(123456).help('number').done(),
        $ptb.text('Text').value('Dashing is cool').done(),
        $ptb.progressbar('Capacity').value({current: 30, max: 1024}).done(),
        $ptb.bytes('Bytes Unit').value({raw: 2684354560, unit: 'B', readable: true}).done(),
        $ptb.bytes('Bytes').value({raw: 2684354560, unit: 'B'}).done(),
        $ptb.bytes('Bytes (simple)').value(5566).done()
      ];

      $scope.bytes = Math.random() * 10000000;
      $scope.bytesValue = {raw: 2684354560, unit: 'B'};
      $interval(function() {
        $ptb.$update($scope.propsVariable, [
          Math.random() * 100000,
          'Dashing is cool',
          {current: (Math.random() * 1024).toFixed(0), max: 1024},
          {raw: Math.random() * 10000000, unit: 'B', readable: true},
          {raw: Math.random() * 10000000, unit: 'B'},
          Math.random() * 100000
        ]);
        $scope.bytes = Math.random() * 10000000;
        $scope.bytesValue = {raw: Math.random() * 10000000, unit: 'B', readable: true};
      }, 2000);
    }])
;