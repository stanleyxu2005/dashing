# CHANGELOG

The file only contains the major changes. For full changes, please check the commit log.

## 0.2.5
* Chart: Added ring chart

## 0.2.4
* Chart: Prior to 0.2.2, found a solution to remove tooltip placeholder completely.

## 0.2.3 (Hotfix to 0.2.2)
* Build: Too many blank spaces were removed unexpectedly by build script in 0.2.2. 
* Exposed toHumanReadableDuration to util module.

## 0.2.2
* Chart: If visibleDataPointsNum is specified, the chart will be initialized the empty point positions with placeholders. This change fixes animation flicker while adding data points.
* Chart: Add grouping support. (Dashing-deps 0.0.7 is required)
* Property Table: Builder is able to change layout direction for a multiple renderers cell.
* Build: Build script will remove too many blank spaces in HTML. 

## 0.2.0
* Chart: Polished the look and feel of data points.
* Chart: Bar chart will have more layouts (including rotated chart, bar with negative color).

## 0.1.9
* Chart: Throusand separator support for chart labels and tooltips.
* Build: npm will include release files and github will be responsible for source code only.

## 0.1.8
* Chart: Add timeline support (Previously x-axis can only have string labels)

## 0.1.7
* Chart: If no initial data is provided, the chart is still able to be created. With a "No Graph Data Available" animation.
* Sortable Table: Default sort was wrong.

## 0.1.6
* Chart: Auto format y-axis. By default it will be formatted in a human reabled notation.
* Chart: Line chart will have minor split lines.

## 0.1.4
* Property Table: Provided builder functions to build and update table.
* Chart: Bar chart will calculate bar width regarding specified data values.
* Build: Moved the custom Echarts build to dashing-deps project.
* The older versions are not ducumented well. We start the change log from here.