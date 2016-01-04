/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.forms.form_control', [
  'ngSanitize', // required for ng-bind-html
  'dashing.filters.any',
  'dashing.util.validation',
  'mgcrea.ngStrap',
  'ui.select'
])
/**
 * Ready to use form controls.
 *
 * Every control will occupy one row. The label will be shown at the left side. You still
 * need to add a Bootstrap 3 class "form-horizontal" in the outer <form> tag.
 *
 * @param type enum(text|class|choices|radio|multi-checks|check|integer|datetime) (default is text input)
 * @param label string
 *   the text left to the control (if the container is too narrow, label will be moved to above)
 * @param ng-model object
 * @param required boolean (optional)
 *   when required is set, necessary validation will be triggered, after value is changed
 * @param invalid object (optional)
 *   when required is set, the object will stored the valid state.
 *
 * The widget is being changed actively, please check the source code or example to discover more usage.
 *
 * @example
 *   <form-control
 *     type="text" label="Text Input" ng-model="value"
 *     required="true" invalid="state">
 *   </form-control>
 */
  .directive('formControl', ['dashing.util.validation', function(validation) {
    'use strict';

    function buildChoicesForSelect(choices) {
      var result = [];
      angular.forEach(choices, function(choice, value) {
        if (angular.isString(choice)) {
          choice = {text: choice};
        }
        result.push({
          value: value,
          text: choice.text,
          subtext: choice.subtext
        });
      });
      return result;
    }

    function buildChoicesForRadioGroup(choices) {
      var result = [];
      angular.forEach(choices, function(choice, value) {
        result.push({
          value: value,
          text: choice
        });
      });
      return result;
    }

    function buildChoicesForDropDownMenu(choices, onSelect) {
      return choices.map(function(choice) {
        if (angular.isString(choice)) {
          choice = {text: choice};
        }
        return {
          text: (choice.icon ? '<i class="' + choice.icon + '"></i> ' : '') + choice.text,
          click: function() {
            onSelect(choice.text);
          }
        };
      });
    }

    return {
      restrict: 'E',
      templateUrl: 'forms/form_controls.html',
      replace: true,
      scope: {
        help: '@',
        value: '=ngModel',
        invalid: '='
      },
      link: function(scope, elem, attrs) {
        scope.labelStyleClass = attrs.labelStyleClass || 'col-sm-3';
        scope.controlStyleClass = attrs.controlStyleClass || 'col-sm-9';
        scope.choiceIconStyleClass = attrs.choiceIconStyleClass || 'glyphicon glyphicon-menu-hamburger';
        scope.label = attrs.label; // don't put to scope section, we might change it before rendering
        scope.renderAs = attrs.type;
        scope.pristine = true;
        scope.invalid = attrs.required;

        // Special post initialization
        switch (attrs.type) {
          case 'class':
            scope.renderAs = 'text';
            scope.validateFn = validation.class;
            break;

          case 'choices':
            scope.placeholder = attrs.searchPlaceholder;
            scope.choices = buildChoicesForSelect(eval('(' + attrs.choices + ')'));
            scope.allowSearchInChoices = attrs.hasOwnProperty('searchEnabled') ?
              (attrs.searchEnabled === 'true') : Object.keys(scope.choices).length >= 5;
            scope.allowClearSelection = !attrs.required;
            break;

          case 'radio':
            scope.choices = buildChoicesForRadioGroup(eval('(' + attrs.choices + ')'));
            scope.buttonStyleClass = attrs.btnStyleClass || 'btn-sm';
            scope.toggle = function(value) {
              scope.value = value;
            };
            break;

          case 'multi-checks':
            scope.choices = eval('(' + attrs.choices + ')');
            if (!Array.isArray(scope.choices)) {
              scope.choices = [attrs.choices];
            }
            if (!Array.isArray(scope.value)) {
              scope.value = scope.choices.map(function() {
                return false;
              });
            }
            break;

          case 'check':
            scope.text = scope.label;
            scope.label = '';
            break;

          case 'integer':
            scope.min = attrs.min;
            scope.max = attrs.max;
            scope.validateFn = function(value) {
              return validation.integerInRange(value, attrs.min, attrs.max);
            };
            break;

          case 'datetime':
            scope.dateControlStyleClass = attrs.dateControlStyleClass || 'col-md-5';
            scope.timeControlStyleClass = attrs.timeControlStyleClass || 'col-md-4';
            scope.fillDefaultDate = function() {
              if (!scope.dateValue) {
                scope.dateValue = new Date();
              }
            };
            scope.fillDefaultTime = function() {
              if (!scope.timeValue) {
                var now = new Date();
                now.setSeconds(0);
                now.setMilliseconds(0);
                scope.timeValue = now;
              }
            };
            // date time control has a built-in validator
            scope.dateInputInvalid = false;
            scope.timeInputInvalid = false;
            scope.$watch('dateValue', function(newVal, oldVal) {
              scope.dateInputInvalid = angular.isUndefined(newVal) && !angular.isUndefined(oldVal);
              scope.invalid = scope.dateInputInvalid || scope.timeInputInvalid;
              if (newVal) {
                scope.value = [newVal, scope.timeValue];
              }
            });
            scope.$watch('timeValue', function(newVal, oldVal) {
              scope.timeInputInvalid = angular.isUndefined(newVal) && !angular.isUndefined(oldVal);
              scope.invalid = scope.dateInputInvalid || scope.timeInputInvalid;
              if (newVal) {
                scope.value = [scope.dateValue, newVal];
              }
            });
            scope.$watchCollection('value', function(val) {
              if (Array.isArray(val) && val.length === 2) {
                scope.dateValue = val[0];
                scope.timeValue = val[1];
              }
            });
            break;

          case 'upload':
            scope.acceptPattern = attrs.acceptPattern;
            scope.filename = ''; // must be '', otherwise MSIE will not response expectedly
            scope.$watch('files', function(files) {
              if (Array.isArray(files) && files.length) {
                scope.value = files[0];
                scope.filename = files[0].name;
              } else {
                scope.value = null;
                scope.filename = '';
              }
            });
            scope.openUpload = function() {
              if (!scope.files) {
                var spans = elem.find('span');
                if (spans.length > 2) {
                  var uploadButton = spans[spans.length - 2];
                  uploadButton.click();
                }
              }
            };
            scope.clearSelection = function() {
              scope.files = null;
            };
            break;

          default:
            scope.hideMenuCaret = ['true', '1'].indexOf(String(attrs.hideMenuCaret)) !== -1;
            break;
        }

        // provide a choice list for text-input control
        if (scope.renderAs === 'text' && attrs.choices) {
          scope.choicesMenu = buildChoicesForDropDownMenu(
            eval('(' + attrs.choices + ')'),
            function(choice) {
              scope.value = choice;
            });
        }

        scope.$watch('value', function(value) {
          scope.pristine = (attrs.type !== 'integer') // integer value out of the range will be `undefined`
            && (value || '').length === 0;
          scope.invalid =
            (angular.isFunction(scope.validateFn) && !scope.validateFn(value)) ||
            (attrs.required && scope.pristine);
        });
      }
    };
  }])
;