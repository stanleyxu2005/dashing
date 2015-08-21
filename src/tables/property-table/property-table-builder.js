/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.tables.property-table.builder', [])
/**
 * A helper class to build column as a chained object
 */
  .factory('$propertyTableBuilder', ['PROPERTY_RENDERER',
    function(PROPERTY_RENDERER) {
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
          return new PB(PROPERTY_RENDERER.BUTTON, title);
        },
        bytes: function(title) {
          return new PB(PROPERTY_RENDERER.BYTES, title);
        },
        datetime: function(title) {
          return new PB(PROPERTY_RENDERER.DATETIME, title);
        },
        duration: function(title) {
          return new PB(PROPERTY_RENDERER.DURATION, title);
        },
        indicator: function(title) {
          return new PB(PROPERTY_RENDERER.INDICATOR, title);
        },
        link: function(title) {
          return new PB(PROPERTY_RENDERER.LINK, title);
        },
        number: function(title) {
          return new PB(PROPERTY_RENDERER.NUMBER, title);
        },
        progressbar: function(title) {
          return new PB(PROPERTY_RENDERER.PROGRESS_BAR, title);
        },
        tag: function(title) {
          return new PB(PROPERTY_RENDERER.TAG, title);
        },
        text: function(title) {
          return new PB(PROPERTY_RENDERER.TEXT, title);
        }
      };

      // todo: build values regarding renderer type
    }])
;