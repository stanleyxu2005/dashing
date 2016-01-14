/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.charts.look_and_feel', [
  'dashing.util'
])
/**
 * Customize chart's look and feel.
 */
  .factory('dashing.charts.look_and_feel', ['dashing.util', function(util) {
    'use strict';

    var self = {
      /**
       * Return a recommended color palette for line chart.
       */
      lineChartColorRecommendation: function(seriesNum) {
        var colors = util.color.palette;
        switch (seriesNum) {
          case 1:
            return [colors.blue];
          case 2:
            return [colors.blue, colors.blueishGreen];
          default:
            return util.array.repeatArray([
              colors.blue,
              colors.purple,
              colors.blueishGreen,
              colors.darkRed,
              colors.orange
            ], seriesNum);
        }
      },
      /**
       * Return a recommended color palette for bar chart.
       */
      barChartColorRecommendation: function(seriesNum) {
        var colors = util.color.palette;
        switch (seriesNum) {
          case 1:
            return [colors.lightBlue];
          case 2:
            return [colors.blue, colors.darkBlue];
          default:
            return util.array.repeatArray([
              colors.lightGreen,
              colors.darkGray,
              colors.lightBlue,
              colors.blue,
              colors.darkBlue
            ], seriesNum);
        }
      },
      /**
       * Return a recommended color palette for ring chart.
       */
      ringChartColorRecommendation: function(seriesNum) {
        return self.barChartColorRecommendation(seriesNum);
      },
      /**
       * Build colors for state set.
       */
      buildColorStates: function(base) {
        return {
          line: base,
          area: util.color.lighter(base, -0.92),
          hover: util.color.lighter(base, 0.15)
        };
      }
    };
    return self;
  }])
;