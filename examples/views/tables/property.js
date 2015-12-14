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

      $scope.props = [
        $ptb.number('Number').value(123456).help('number').done(),
        $ptb.text('Text').value('Dashing is cool').done(),
        $ptb.progressbar('Capacity').value({current: 30, max: 1024}).done(),
        $ptb.number('Number (simple)').value(5566).done(),
        $ptb.number('Number (precision=2)').value({raw: 5566, precision: 2}).done(),
        $ptb.number('Number with unit').value({raw: 2684354560, unit: 'B'}).done(),
        $ptb.number('Human Readable Number').value({raw: 2684354560, unit: 'B', readable: true}).done(),
        $ptb.tag('Running Status').value({condition: 'good', text: 'Healthy'}).done()
      ];

      $interval(function() {
        $ptb.$update($scope.props, {
          0: Math.random() * 100000,
          /* dont change 1, which is static text */
          2: {current: (Math.random() * 1024).toFixed(0), max: 1024},
          3: Math.random() * 100000,
          4: Math.random() + Math.random() * 100000,
          5: {raw: Math.random() * 10000000, unit: 'B'},
          6: {raw: Math.random() * 10000000, unit: 'B', readable: true},
          7: Math.random() > 0.5 ?
          {condition: 'concern', text: 'Has Concern'} :
          {condition: 'good', text: 'Healthy'}
        });
      }, 2000);
    }])
;