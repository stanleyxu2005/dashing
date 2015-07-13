/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.tables.sortable-table', [
  'smart-table' // smart-table
])
/**
 * A customized "smart-table" widget which is sortable; has nice pagination
 * control; is able to bind with a nice external search controls.
 *
 * @example
 *  <sortable-table
 *    caption="Table caption"
 *    pagination="5" empty-row-as-br="1"
 *    columns-bind="columnsVariable"
 *    records-bind="recordsVariable"
 *    search-bind="searchVariable">
 *  </sortable-table>
 *
 *    @param caption string
 *      the caption of the table (optional)
 *    @param pagination int
 *      the number of records to be shown per page (optional)
 *    @param columns-bind array
 *      an array of column objects (todo: provide a builder)
 *    @param records-bind array
 *      an array of record objects (todo: provide a builder)
 *    @param search-bind string
 *      the text in a global search bar (optional)
 */
  .directive('sortableTable', function() {
    'use strict';
    return {
      templateUrl: 'tables/sortable-table/sortable-table.html',
      restrict: 'E',
      scope: {
        caption: '@',
        pagination: '@',
        emptyRowAsBr: '=',
        columns: '=columnsBind',
        records: '=recordsBind',
        search: '=searchBind'
      },
      controller: ['$scope', '$element', '$sce', function($scope, $element, $sce) {
        // TODO: https://github.com/lorenzofox3/Smart-Table/issues/436
        var elem = $element.find('input')[0];
        $scope.$watch('search', function(val) {
          elem.value = val || ''; // empty string means to show all records
          angular.element(elem).triggerHandler('input');
        });

        $scope.$watch('emptyRowAsBr', function(val) {
          $scope.emptyRowContent = $sce.trustAsHtml(
            angular.isDefined(val) ?
              (val > 0 ? $scope.range(Number(val), '<br/>').join('') : '') :
              '&nbsp;'
          );
        });
        $scope.stylingFn = function(col) {
          return col.style +
            (['Number'].indexOf(col.renderer) !== -1 ? ' text-right' : '');
        };
        // Expose isArray into template.
        $scope.isArray = angular.isArray;
        // Create an array with exact N elements
        $scope.range = function(count, fill) {
          return count > 0 ?
            Array.apply(null, {length: count}).map(function(_, index) {
              return fill || index;
            }) : [];
        };
      }]
    };
  })
/**
 * Override smart-table's default behavior(s)
 */
  .config(['stConfig', function(stConfig) {
    'use strict';
    stConfig.sort.skipNatural = true;
  }])
;