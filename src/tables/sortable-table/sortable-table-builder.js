/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.tables.sortable-table.builder', [
  'dashing.property',
  'dashing.util'
])
/**
 * A helper class to build column as a chained object
 */
  .factory('$sortableTableBuilder', ['dashing.util', 'dsPropertyRenderer',
    function(util, renderer) {
      'use strict';

      var CB = function(renderer, title) {
        this.props = renderer ? {renderer: renderer} : {};
        if (title) {
          this.title(title);
        }
      };

      CB.prototype.title = function(title) {
        this.props.name = title;
        return this;
      };

      CB.prototype.key = function(key) {
        this.props.key = key;
        return this;
      };

      CB.prototype.canSort = function(overrideSortKey) {
        if (!overrideSortKey && !this.props.key) {
          console.warn('Specify a sort key or define column key first!');
          return;
        }

        this.props.sortKey = overrideSortKey || this.props.key;
        if (this.props.sortKey === this.props.key) {
          switch (this.props.renderer) {
            case renderer.LINK:
              this.props.sortKey += '.text';
              break;
            case renderer.INDICATOR:
            case renderer.TAG:
              this.props.sortKey += '.condition';
              break;
            case renderer.PROGRESS_BAR:
              this.props.sortKey += '.usage';
              break;
            case renderer.BYTES:
              this.props.sortKey += '.raw';
              break;
            case renderer.BUTTON:
              console.warn('"%s" column is not sortable.');
              return;
            default:
          }
        }
        return this;
      };

      CB.prototype.sortDefault = function(descent) {
        if (!this.props.sortKey) {
          console.warn('Specify a sort key or define column key first!');
          return;
        }
        this.props.defaultSort = descent ? 'reverse' : true;
        return this;
      };

      CB.prototype.sortDefaultDescent = function() {
        return this.sortDefault(/*descent=*/true);
      };

      CB.prototype.styleClass = function(styleClass) {
        this.props.styleClass = styleClass;
        return this;
      };

      CB.prototype.sortBy = function(sortKey) {
        this.props.sortKey = sortKey;
        return this;
      };

      CB.prototype.unit = function(unit) {
        this.props.unit = unit;
        return this;
      };

      CB.prototype.help = function(help) {
        this.props.help = help;
        return this;
      };

      CB.prototype.vertical = function() {
        if (Array.isArray(this.props.key)) {
          this.props.vertical = true;
        }
        return this;
      };

      CB.prototype.done = function() {
        return this.props;
      };

      return {
        button: function(title) {
          return new CB(renderer.BUTTON, title);
        },
        bytes: function(title) {
          return new CB(renderer.BYTES, title);
        },
        datetime: function(title) {
          return new CB(renderer.DATETIME, title);
        },
        duration: function(title) {
          return new CB(renderer.DURATION, title);
        },
        indicator: function(title) {
          return new CB(renderer.INDICATOR, title);
        },
        link: function(title) {
          return new CB(renderer.LINK, title);
        },
        multiple: function(title, renderers) {
          return new CB(renderers, title);
        },
        number: function(title) {
          return new CB(renderer.NUMBER, title);
        },
        progressbar: function(title) {
          return new CB(renderer.PROGRESS_BAR, title);
        },
        tag: function(title) {
          return new CB(renderer.TAG, title);
        },
        text: function(title) {
          return new CB(renderer.TEXT, title);
        },

        /** Debug util */
        $check: function(cols, model) {
          angular.forEach(cols, function(col) {
            var keys = util.array.ensureArray(col.key);
            angular.forEach(keys, function(key) {
              if (!model.hasOwnProperty(key)) {
                console.warn('Model does not have a property matches column key `' + col + '`.');
              }
            });
          });
        }
      };
    }])
;