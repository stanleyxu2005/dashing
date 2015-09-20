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

  .controller('SortableTableControl', ['$scope', '$sortableTableBuilder',
    function($scope, $stb) {
      'use strict';

      $scope.columnsVariable = [
        $stb.indicator().key('status').done(),
        $stb.text('Name').key('name').canSort().sortDefault().styleClass('col-md-6').done(),
        $stb.number('Count').key('count').canSort().styleClass('col-md-6').done()
      ];

      $scope.recordsVariable = [{
        status: {shape: 'stripe', condition: 'good', tooltip: 'You should see a 8px wide stripe'},
        name: 'Record #1',
        count: 10000000
      }, {
        status: {shape: 'stripe', condition: 'good', tooltip: 'You should see a 8px wide stripe'},
        name: 'Record #2',
        count: 20000000
      }];
    }])
;