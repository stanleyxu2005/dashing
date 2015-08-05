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
 *      an array of column objects
 *    @param records-bind array
 *      an array of record objects
 *    @param search-bind string
 *      the text in a global search bar (optional)
 */
  .directive('sortableTable', function() {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'tables/sortable-table/sortable-table.html',
      scope: {
        caption: '@',
        pagination: '@',
        columns: '=columnsBind',
        records: '=recordsBind',
        search: '=searchBind'
      },
      link: function(scope, elem) {
        // TODO: https://github.com/lorenzofox3/Smart-Table/issues/436
        var searchControl = elem.find('input')[0];
        scope.$watch('search', function(val) {
          searchControl.value = val || ''; // empty string means to show all records
          angular.element(searchControl).triggerHandler('input');
        });

        // Columns are not changed after table is created, we cache frequently accessed values rather than
        // evaluating them in every digest cycle.
        scope.$watch('columns', function(columns) {
          // 1
          scope.columnStyleClass = columns.map(function(column) {
            function addStyleClass(dest, clazz, condition) {
              if (condition) {
                dest.push(clazz);
              }
            }

            var array = [];
            addStyleClass(array, column.styleClass, column.styleClass !== undefined);
            addStyleClass(array, 'text-right', 'Number' === column.renderer);
            addStyleClass(array, 'text-nowrap', angular.isArray(column.key) && !column.vertical);
            return array.join(' ');
          });
          // 2
          scope.multipleRendererColumnsRenderers = columns.map(function(column) {
            if (!angular.isArray(column.key)) {
              return null; // Template will not call the method at all
            }
            if (angular.isArray(column.renderer)) {
              if (column.renderer.length !== column.key.length) {
                console.error('Every column key should have a renderer, or share one renderer.');
              }
              return column.renderer;
            }
            return column.key.map(function() {
              return column.renderer;
            });
          });
        });

        // Expose isArray into template.
        scope.isArray = angular.isArray;
        // Return element at particular index or fallback to the object
        scope.get = function(obj, index) {
          return angular.isArray(obj) ? obj[index] : obj;
        };
      }
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