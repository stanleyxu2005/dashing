/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.tables.sortable_table', [
  'smart-table', // smart-table
  'dashing.property',
  'dashing.util'
])
/**
 * A table control (based on "angular-smart-table" with these key features:
 *  (1) Columns are sortable
 *  (2) Support automatic pagination
 *  (3) Bind with external search control
 *
 * We recommend to use the `$sortableTableBuilder` to build/update table.
 *
 *  @param columns-bind array
 *    an array of column objects
 *  @param records-bind array
 *    an array of record objects
 *  @param caption string (optional)
 *    the caption of the table
 *  @param pagination int (optional)
 *    the number of records to be shown per page
 *  @param search-bind object (optional)
 *    the variable stores the text to be searched (table will be filtered by the text)
 *
 * @example
 *  <sortable-table
 *    columns-bind="columnsVariable"
 *    records-bind="recordsVariable"
 *    caption="Table caption"
 *    pagination="5"
 *    search-bind="searchVariable">
 *  </sortable-table>
 */
  .directive('sortableTable', ['dsPropertyRenderer', 'dashing.util', function(renderer, util) {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'tables/sortable_table/sortable_table.html',
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
          if (!Array.isArray(columns)) {
            console.warn('Failed to create table, until columns are defined.');
            return;
          }
          // 1
          scope.columnStyleClass = columns.map(function(column) {
            function addStyleClass(dest, clazz, condition) {
              if (condition) {
                dest.push(clazz);
              }
            }

            var array = [];
            addStyleClass(array, column.styleClassArray.join(' '), column.styleClassArray.length);
            addStyleClass(array, 'text-nowrap', Array.isArray(column.key) && !column.vertical);
            return array.join(' ');
          });
          // 2: MSIE cannot fill indication(shape=stripe) to tabel cell, so we fill a background color manually
          var possibleStripeColumns = columns.map(function(column) {
            if (!Array.isArray(column.key) && column.renderer === renderer.INDICATOR) {
              return column.key;
            }
          });
          scope.bgColorForStripeFix = function(index, record) {
            var key = possibleStripeColumns[index];
            if (key) {
              var cell = record[key];
              if (cell.shape === 'stripe') {
                return util.color.conditionToColor(cell.condition);
              }
            }
          };
          // 3
          scope.multipleRendererColumnsRenderers = columns.map(function(column) {
            if (!Array.isArray(column.key)) {
              return null; // Template will not call the method at all
            }
            if (Array.isArray(column.renderer)) {
              if (column.renderer.length !== column.key.length) {
                console.warn('Every column key should have a renderer, or share one renderer.');
              }
              return column.renderer;
            }
            return column.key.map(function() {
              return column.renderer;
            });
          });
        });

        // Expose isArray into template.
        scope.isArray = Array.isArray;
      }
    };
  }])
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
    stConfig.sort.delay = -1;
  }])
;