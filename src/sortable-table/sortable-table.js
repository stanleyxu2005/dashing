/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.sortable-table', [
  'smart-table' // smart-table
])
/**
 * Sortable table with pagination control.
 *
 * @example
 *  <sortable-table
 *    caption="Table caption" pagination="5"
 *    columns-bind="columnsVariable"
 *    records-bind="recordsVariable">
 *  </sortable-table>
 *
 *    @param caption string
 *      the caption of the table (optional)
 *    @param pagination int
 *      the number of records to be shown per page (optional)
 *    @param searchable string
 *      the text in a global search bar (optional)
 *    @param columnsBind array
 *      an array of column objects (todo: provide a builder)
 *    @param recordsBind array
 *      an array of record objects (todo: provide a builder)
 */
  .directive('sortableTable', function() {
    'use strict';
    return {
      templateUrl: 'sortable-table/sortable-table.html',
      restrict: 'E',
      scope: {
        caption: '@',
        pagination: '@',
        searchable: '@',
        columns: '=columnsBind',
        records: '=recordsBind'
      },
      controller: ['$scope', function($scope) {
        $scope.stylingFn = function(col) {
          return col.style +
            (['Number'].indexOf(col.renderer) !== -1 ? ' text-right' : '');
        };
        /** Expose isArray into template. */
        $scope.isArray = angular.isArray;
      }],
    };
  })
  /** Override smart-table's default behavior(s). */
  .config(['stConfig', function(stConfig) {
    'use strict';
    stConfig.sort.skipNatural = true;
  }])
;