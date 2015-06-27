/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.property-table', [])
/**
 * A two column table. The first column is the property name. The second column is
 * the value of the property rendered in a suitable way.
 *
 * @example
 *  <property-table
 *    caption="Table caption"
 *    props-bind="propsVariable">
 *  </property-table>
 *
 *    @param caption string (optional)
 *      the caption of the table
 *    @param propsBind array
 *      an array of property objects (todo: provide a builder)
 */
  .directive('propertyTable', function () {
    'use strict';
    return {
      templateUrl: 'property-table/property-table.html',
      restrict: 'E',
      scope: {
        caption: '@',
        props: '=propsBind',
        propNameClass: '@',
        propValueClass: '@'
      }
    };
  })
;