/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.contextmenu', [
  'mgcrea.ngStrap.dropdown' // angular-strap
])
/**
 * A context menu helper that can popup an element (e.g. dropdown menu) at any position of any surface.
 *
 * @example
 *  <div bs-dropdown="..."></div>
 */
  .factory('$contextmenu', function() {
    'use strict';
    return {
      popup: function(elem, position) {
        angular.element(elem).css({left: position.x + 'px', top: position.y + 'px'});
        angular.element(elem).triggerHandler('click');
      }
    };
  })
;