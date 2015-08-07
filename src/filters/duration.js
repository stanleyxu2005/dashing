/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.filters.duration', [])
/**
 * Converts milliseconds to human readable duration representation.
 * */
  .filter('duration', function() {
    'use strict';

    return function(millis, compact) {
      var x = parseInt(millis, 10);
      if (isNaN(x)) {
        return millis;
      }

      var units = [
        {label: 'ms', mod: 1000},
        {label: compact ? 's' : 'secs', mod: 60},
        {label: compact ? 'min' : 'mins', mod: 60},
        {label: compact ? 'hr' : 'hours', mod: 24},
        {label: compact ? 'd' : 'days', mod: 7},
        {label: compact ? 'wk' : 'weeks', mod: 52}
      ];
      var duration = [];

      for (var i = 0; i < units.length; i++) {
        var unit = units[i];
        var t = x % unit.mod;
        if (t !== 0) {
          duration.unshift({label: unit.label, value: t});
        }
        x = (x - t) / unit.mod;
      }

      duration = duration.slice(0, 2);
      if (duration.length > 1 && duration[1].label === 'ms') {
        duration = [duration[0]];
      }
      return duration.map(function(unit) {
        return unit.value + ' ' + unit.label;
      }).join(compact ? ' ' : ' and ');
    };
  })
;