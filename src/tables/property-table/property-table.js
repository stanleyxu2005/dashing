/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.tables.property-table', [])
/**
 * A two column table. The first column is the property name. The second column is
 * the value of the property rendered in a suitable way.
 *
 * @param caption string (optional)
 *   the caption of the table
 * @param props-bind array
 *   an array of property objects
 *
 * @example
 *  <property-table
 *    caption="Table caption"
 *    props-bind="propsVariable"
 *    prop-name-class="col-md-4"
 *    prop-value-class="col-md-8">
 *  </property-table>
 */
  .directive('propertyTable', function() {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'tables/property-table/property-table.html',
      scope: {
        caption: '@',
        props: '=propsBind',
        propNameClass: '@',
        propValueClass: '@'
      }
    };
  })
;