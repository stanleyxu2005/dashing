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
 * @param caption-tooltip string (optional)
 *   the tooltip of the caption
 * @param sub-caption string (optional)
 *   the table description
 *
 * @example
 *  <property-table
 *    props-bind="propsVariable"
 *    prop-name-class="col-md-4"
 *    prop-value-class="col-md-8"
 *    caption="Table caption"
 *    caption-tooltip="What is this table"
 *    sub-caption="Table description">
 *  </property-table>
 */
  .directive('propertyTable', function() {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'tables/property_table/property_table.html',
      scope: {
        caption: '@',
        captionTooltip: '@',
        subCaption: '@',
        props: '=propsBind',
        propNameClass: '@',
        propValueClass: '@'
      }
    };
  })
;