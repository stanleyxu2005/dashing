/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */

angular.module('examples')

  .config(['$stateProvider',
    function($stateProvider) {
      'use strict';

      $stateProvider
        .state('sortable-table', {
          url: '/tables/sortable',
          templateUrl: 'views/tables/sortable.html',
          controller: 'SortableTableControl'
        });
    }])

  .controller('SortableTableControl', ['$scope', '$interval', '$sortableTableBuilder',
    function($scope, $interval, $stb) {
      'use strict';

      $scope.data = {
        cols: [
          $stb.indicator().key('status').styleClass('stripe-cell-fix').done(),
          $stb.number('ID').key('id').canSort().sortDefaultDescent().styleClass('col-md-2').textLeft().done(),
          $stb.text('Description').key('name').canSort().styleClass('col-md-4').done(),
          $stb.number('Average QPS').key('qps').unit('Past minute').canSort().styleClass('col-md-6').done()
        ],
        rows: []
      };

      $scope.recordsCount = 10000;
      $scope.updateIntervalInSeconds = 3;

      function updateRecords() {
        var newValueArray = _.times($scope.recordsCount, function(i) {
          return {
            status: {shape: 'stripe', condition: 'good', tooltip: 'You should see a 8px wide stripe'},
            id: i,
            name: 'Some text',
            qps: Math.random() * 1000000
          };
        });
        $scope.data.rows = $stb.$update($scope.data.rows, newValueArray, 'id');
      }

      updateRecords();
      var p = $interval(updateRecords, $scope.updateIntervalInSeconds * 1000);
      $scope.$on('destroy', function() {
        if (p) {
          $interval.clear(p);
        }
      })

    }])
;