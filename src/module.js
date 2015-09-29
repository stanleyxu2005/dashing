/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */

/* Module register */
angular.module('dashing', [
  // directives
  'dashing.charts.bar',
  'dashing.charts.line',
  'dashing.charts.metrics_sparkline',
  'dashing.charts.ring',
  'dashing.charts.sparkline',
  'dashing.forms.form_control',
  'dashing.forms.searchbox',
  'dashing.metrics',
  'dashing.progressbar',
  'dashing.property',
  'dashing.property.bytes',
  'dashing.remark',
  'dashing.state.indicator',
  'dashing.state.tag',
  'dashing.tables.property_table',
  'dashing.tables.sortable_table',
  'dashing.tabset',
  // helpers
  'dashing.contextmenu',
  'dashing.tables.property_table.builder',
  'dashing.tables.sortable_table.builder',
  // filters
  'dashing.filters.any',
  'dashing.filters.duration'
]);