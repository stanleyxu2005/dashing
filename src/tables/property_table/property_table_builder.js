/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.tables.property_table.builder', [])
/**
 * A helper class to build column as a chained object
 */
  .factory('$propertyTableBuilder', ['dsPropertyRenderer',
    function(renderer) {
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

      PB.prototype.value = function(value) {
        this.props.value = value;
        return this;
      };

      PB.prototype.values = function(values) {
        if (!Array.isArray(values)) {
          console.warn('values must be an array');
          values = [values];
        }
        this.props.values = values;
        return this;
      };

      PB.prototype.done = function() {
        return this.props;
      };

      return {
        button: function(title) {
          return new PB(renderer.BUTTON, title);
        },
        bytes: function(title) {
          return new PB(renderer.BYTES, title);
        },
        datetime: function(title) {
          return new PB(renderer.DATETIME, title);
        },
        duration: function(title) {
          return new PB(renderer.DURATION, title);
        },
        indicator: function(title) {
          return new PB(renderer.INDICATOR, title);
        },
        link: function(title) {
          return new PB(renderer.LINK, title);
        },
        number: function(title) {
          return new PB(renderer.NUMBER, title);
        },
        progressbar: function(title) {
          return new PB(renderer.PROGRESS_BAR, title);
        },
        tag: function(title) {
          return new PB(renderer.TAG, title);
        },
        text: function(title) {
          return new PB(renderer.TEXT, title);
        },

        /** Updates table values */
        $update: function(props, values) {
          angular.forEach(values, function(value, index) {
            var field = Array.isArray(value) ? 'values' : 'value';
            props[index][field] = value;
          });
        }
      };

      // todo: build values regarding renderer type
    }])
;