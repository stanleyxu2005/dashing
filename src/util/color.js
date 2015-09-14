/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.util.color', [])

  .factory('dashing.util.color', function() {
    'use strict';

    return {
      /**
       * Return pre-defined color palette.
       */
      palette: {
        blue: 'rgb(0,119,215)',
        blueishGreen: 'rgb(41,189,181)',
        orange: 'rgb(255,127,80)',
        purple: 'rgb(110,119,215)',
        skyBlue: 'rgb(91,204,246)',
        darkBlue: 'rgb(102,168,212)',
        darkGray: 'rgb(92,92,97)',
        darkPink: 'rgb(212,102,138)',
        darkRed: 'rgb(212,102,138)',
        lightBlue: 'rgb(149,206,255)',
        lightGreen: 'rgb(169,255,150)'
      }
    };
  })
;