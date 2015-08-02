/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.tables.property-table', [])
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
 *    @param props-bind array
 *      an array of property objects (todo: provide a builder)
 */
  .directive('propertyTable', function () {
    'use strict';
    return {
      templateUrl: 'tables/property-table/property-table.html',
      restrict: 'E',
      scope: {
        caption: '@',
        props: '=propsBind',
        propNameClass: '@',
        propValueClass: '@'
      }
    };
  })
/**
 * A helper class to build column as a chained object
 */
  .factory('$ptBuilder', function() {
    var PB = function(renderer, title) {
      this.props = renderer ? {renderer: renderer} : {};
      if (title) {
        this.title(title);
      }
    };
    PB.prototype.title = function(title) {
      this.props.name = title;
      return this;
    };
    PB.prototype.help = function(help) {
      this.props.help = help;
      return this;
    };
    PB.prototype.done = function() {
      return this.props;
    };

    return {
      button: function(title) {
        return new PB('Button', title);
      },
      datetime: function(title) {
        return new PB('DateTime', title);
      },
      duration: function(title) {
        return new PB('Duration', title);
      },
      indicator: function(title) {
        return new PB('Indicator');
      },
      link: function(title) {
        return new PB('Link', title);
      },
      number: function(title) {
        return new PB('Number', title);
      },
      progressbar: function(title) {
        return new PB('ProgressBar', title);
      },
      state: function(title) {
        return new PB('State', title);
      },
      text: function(title) {
        return new PB(undefined, title);
      }
    };
  })
;