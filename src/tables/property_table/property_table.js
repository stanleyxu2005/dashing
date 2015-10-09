/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.tables.property_table', [])
/**
 * A two column table. The first column is the property name. The second column is
 * the value of the property rendered in a suitable way.
 *
 * We recommend to use the `$propertyTableBuilder` to build/update table.
 *
 * @param props-bind array
 *   an array of property objects
 * @param prop-name-class string (optional)
 *   style class to override
 * @param prop-value-class string (optional)
 *   style class to override
 * @param caption string (optional)
 *   the caption of the table
 *
 * @example
 *  <property-table
 *    props-bind="propsVariable"
 *    prop-name-class="col-md-4"
 *    prop-value-class="col-md-8"
 *    caption="Table caption">
 *  </property-table>
 */
  .directive('propertyTable', function() {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'tables/property_table/property_table.html',
      scope: {
        caption: '@',
        props: '=propsBind',
        propNameClass: '@',
        propValueClass: '@'
      }
    };
  })
;