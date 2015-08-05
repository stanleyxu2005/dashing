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
 *  <div class="cm-container" id="my_contextmenu"
 *    bs-dropdown data-animation="am-fade"
 *    html="true" template-url="path/to/contextmenu.html"></div>
 *
 *  In script:
 *    var elem = document.getElementById('my_contextmenu');
 *    $contextmenu.popup(elem, {x: 100, y: 100});
 */
  .factory('$contextmenu', function() {
    'use strict';

    return {
      popup: function(elem, position) {
        var elem0 = angular.element(elem);
        elem0.css({left: position.x + 'px', top: position.y + 'px'});
        elem0.triggerHandler('click');
      }
    };
  })
;