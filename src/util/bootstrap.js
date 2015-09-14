/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.util.bootstrap', [])

  .factory('dashing.util.bootstrap', function() {
    'use strict';

    return {
      /** Convert a condition to a Bootstrap label style class */
      conditionToBootstrapLabelClass: function(condition) {
        switch (condition) {
          case 'good':
            return 'label-success';
          case 'concern':
            return 'label-warning';
          case 'danger':
            return 'label-danger';
          default:
            return 'label-default';
        }
      },
      /** Convert a condition to a css color */
      conditionToColor: function(condition) {
        switch (condition) {
          case 'good':
            return '#5cb85c';
          case 'concern':
            return '#f0ad4e';
          case 'danger':
            return '#d9534f';
          default:
            return '#aaa';
        }
      }
    };
  })
;