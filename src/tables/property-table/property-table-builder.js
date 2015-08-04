/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.tables.property-table.builder', [])
/**
 * A helper class to build column as a chained object
 */
  .factory('$propertyTableBuilder', function() {
    'use strict';

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
        return new PB('Indicator', title);
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
      tag: function(title) {
        return new PB('Tag', title);
      },
      text: function(title) {
        return new PB(undefined, title);
      }
    };

    // todo: build values regarding renderer type
  })
;