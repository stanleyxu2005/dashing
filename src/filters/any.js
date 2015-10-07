/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.filters.any', [])
/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
  .filter('any', function() {
    return function(items, props) {
      if (!Array.isArray(items)) {
        return items; // Let the output be the input untouched
      }
      return items.filter(function(item) {
        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var subtext = angular.lowercase(props[prop] || '');
          var text = angular.lowercase(item[prop] || '');
          if (text.indexOf(subtext) !== -1) {
            return true;
          }
        }
        return false;
      });
    }
  })
;