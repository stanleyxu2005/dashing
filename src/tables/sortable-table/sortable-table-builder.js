/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.tables.sortable-table.builder', [])
/**
 * A helper class to build column as a chained object
 */
  .factory('$sortableTableBuilder', function() {
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
    CB.prototype.canSort = function(customKey) {
      if (!this.props.key && !customKey) {
        console.warn('Column key must be specified first');
        return;
      }
      this.props.sortKey = this.props.key || customKey;
      return this;
    };
    CB.prototype.sortDefault = function() {
      this.props.defaultSort = true;
      return this;
    };
    CB.prototype.sortDefaultDescent = function() {
      this.props.defaultSort = 'reverse';
      return this;
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
    CB.prototype.done = function() {
      return this.props;
    };

    return {
      button: function(title) {
        return new CB('Button', title);
      },
      datetime: function(title) {
        return new CB('DateTime', title);
      },
      duration: function(title) {
        return new CB('Duration', title);
      },
      indicator: function(title) {
        return new CB('Indicator', title);
      },
      link: function(title) {
        return new CB('Link', title);
      },
      multiple: function(title, renderers) {
        return new CB(renderers, title);
      },
      number: function(title) {
        return new CB('Number', title);
      },
      progressbar: function(title) {
        return new CB('ProgressBar', title);
      },
      tag: function(title) {
        return new CB('Tag', title);
      },
      text: function(title) {
        return new CB(undefined, title);
      },
      /** Developing util */
      $check: function(cols, model) {
        angular.forEach(cols, function(col) {
          var keys = Array.isArray(col.key) ? col.key : [col.key];
          angular.forEach(keys, function(key) {
            if (!model.hasOwnProperty(key)) {
              console.warn('Model does not have a property matches column key `' + col + '`');
            }
          });
        });
      }
    };
  })
;
