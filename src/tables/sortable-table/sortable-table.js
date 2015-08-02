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
 *    pagination="5"
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
        columns: '=columnsBind',
        records: '=recordsBind',
        search: '=searchBind'
      },
      controller: ['$scope', '$element', function($scope, $element) {
        // TODO: https://github.com/lorenzofox3/Smart-Table/issues/436
        var elem = $element.find('input')[0];
        $scope.$watch('search', function(val) {
          elem.value = val || ''; // empty string means to show all records
          angular.element(elem).triggerHandler('input');
        });

        $scope.stylingFn = function(col) {
          var result = [];
          if (col.styleClass) {
            result.push(col.styleClass);
          }
          if ('Number' === col.renderer) {
            result.push('text-right');
          }
          if (angular.isArray(col.key) && !col.vertical) {
            result.push('text-nowrap');
          }
          return result.join(' ');
        };
        // Expose isArray into template.
        $scope.isArray = angular.isArray;
        // Return element at particular index or fallback to the object
        $scope.get = function(obj, index) {
          return angular.isArray(obj) ? obj[index] : obj;
        };
      }]
    };
  })
  // TODO: as long as st-table does not support pagination start and stop
  // https://github.com/lorenzofox3/Smart-Table/issues/440
  .directive('stSummary', function() {
    'use strict';
    return {
      require: '^stTable',
      template: 'Showing {{ stRange.from }}-{{ stRange.to }} of {{ totalItemCount }} records',
      link: function(scope, element, attrs, stTable) {
        scope.stRange = {
          from: null,
          to: null
        };
        scope.$watch('currentPage', function() {
          var pagination = stTable.tableState().pagination;
          scope.stRange.from = pagination.start + 1;
          scope.stRange.to = scope.currentPage === pagination.numberOfPages ?
            pagination.totalItemCount : (scope.stRange.from + scope.stItemsByPage - 1);
        });
      }
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