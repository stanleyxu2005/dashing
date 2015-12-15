# HISTORY
https://github.com/stanleyxu2005/dashing

The file only contains the major change history. For full change history, please check the commit log.

## 0.3.8
* Bugfix (#46): Sortable table wont render records correctly if sort key's value equals 0.
* Bugfix (#45): Chart's right margin was too large (when only one y-axis is used).
* Bugfix (#42): Added a helper method to update `<sortable-table>` records and changed the pagination control.
* Bugfix (#41): `<sortable-table>` flicker, if default sort direction is descending.

## 0.3.7
* Feature (#22): Polished datetime picker.
* Improvement (#38): Add onclick event to remark icon of `<metrics>`.
* Improvement: Provide a bugfix style for stripe cell in `<sortable-table>`.

## 0.3.6
* Improvement (#26): Support file upload control as `<form-control>`.
* Improvement: `<form-control>` The ng-model of datetime picker is now an array with date string and time string.

## 0.3.5
* Improvement (#37): Pluralize `<metrics>` unit.
* Bugfix (#36): Remark icon might disappear.

## 0.3.4
* Improvement (#35): Open link in new page for property `<button>`.
* Bugfix (#10): Property `<indicator shape="stripe">` wont show in MSIE and Firefox.

## 0.3.3
* Improvement (#34): Allow `<metrics>` to show warning or information remark icon.

## 0.3.1
* Improvement (#33): Property `<bytes>` is deprecated. Use `<number>` instead, which provides precision, unit and human-readable.

## 0.3.0
* Improvement (#31): Allow Number1 and Number2 as showing 1 or 2 digits after period in property table.

## 0.2.9
* Breaking changes (#27): `<form-control>` numeric types are all called "integer". Specify the `min` to `0`, `1` or undefined for different validators. 
* Improvement (#27): `<form-control>` supports "multi-checks" and "check".
* Improvement (#29): `<property renderer="Link">` supports "target=_blank".
* Bugfix (#25): ui-select required style sheets were missing.
* Bugfix (#30): `$sortableTableBuilder` should warn developer to specify a sort key, if multipe keys are defined for a column.

## 0.2.8 (0.2.7 was published to npm corrupted)

## 0.2.7
* Improvement: Added two chinese fonts "Hiragino Sans GB" and "Microsoft YaHei" in style sheets.
* Improvement (#20): Fixed several look and feel glitches when charts are grouped together.
* Bugfix (#21): `<form-control>`'s label should not right aligned when page is very narrow.
* Bugfix: Always show axis line and ticks at the bottom of `<line-chart>`.

## 0.2.6
* Feature (#19): `<form-control>` support radio group.
* Feature (#18): `<line-chart>` allows to have a secondary y-axis.

## 0.2.5
* Feature (#13): Support to render 2-value data as a `<ring-chart>`.
* Improvement: Specify tooltip position for `<remark>`.
* Feature: Added `<form-control>` to build a consistent input form. Supports text/dropdown/numeric inputs with validation.

## 0.2.4
* Improvement (#12): Prior to 0.2.2, found a solution to hide tooltip when chart's selection is empty.

## 0.2.3 (Hotfix to 0.2.2)
* Bugfix : gulp would strip too many blank spaces in 0.2.2. 
* Improvement: Exposed method `toHumanReadableDuration` to util module.

## 0.2.2
* Improvement: If visibleDataPointsNum is specified, the chart will be initialized the empty point positions with placeholders. This change fixes animation flicker while adding data points.
* Feature (#6): Allows to group `<line-chart>` components. (Dashing-deps 0.0.7 is required)
* Improvement (#11): PropertyTableBuilder is able to change layout direction for a multiple renderers cell.

## 0.2.0
* Feature (#8): Polished data points of a `<line-chart>` by having a semi-transparent border.
* Feature (#4, #5): `<bar-chart>` has more layouts (including rotated chart, bar with negative color).

## 0.1.9
* Improvement: Thousand separator support for chart labels and tooltips.
* Improvement: npm will include release files and github will be responsible for source code only.

## 0.1.8
* Feature: Add timeline support for `<line-chart>`. Previously x-axis can only have string labels.

## 0.1.7
* Improvement: If no initial data is provided, the chart is still able to be created. With a "No Graph Data Available" animation.
* Bugfix: The default sort ordering of `<sortable-table>` was wrong.

## 0.1.6
* Feature: Auto format y-axis. By default it will be formatted in a human readable notation.
* Feature: `<line-chart>` will have minor split lines.

## 0.1.4
* Feature: Provided builder to build and update `<property-table>` and `<sortable-table>`.
* Improvement: `<bar-chart>` will calculate bar width regarding specified data values.
* Improvement: Moved the custom Echarts build to dashing-deps project.

*The older versions are not documented well. We start the change log from here.*
