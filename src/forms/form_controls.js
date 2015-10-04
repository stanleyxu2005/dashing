/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.forms.form_control', [
  'dashing.filters.any',
  'dashing.util.validation',
  'mgcrea.ngStrap.datepicker', // angular-strap
  'mgcrea.ngStrap.timepicker', // angular-strap
  'ui.select'
])

/** Ready to use form controls */
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

    function buildChoicesForButtonGroup(choices) {
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
        label: '@',
        value: '=ngModel',
        invalid: '='
      },
      link: function(scope, elem, attrs) {
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
            scope.choices = buildChoicesForSelect(eval('(' + attrs.choices + ')'));
            scope.allowSearchInChoices = Object.keys(scope.choices).length >= 5;
            break;

          case 'radio':
            scope.choices = buildChoicesForButtonGroup(eval('(' + attrs.choices + ')'));
            scope.buttonStyleClass = attrs.btnStyleClass || 'btn-xs';
            scope.toggle = function(value) {
              scope.value = value;
            };
            break;

          case 'integer':
            scope.renderAs = 'number';
            scope.validateFn = validation.integer;
            break;

          case 'positiveInteger':
            scope.renderAs = 'number';
            scope.min = '1';
            scope.validateFn = validation.positiveInteger;
            break;

          case 'nonNegativeInteger':
            scope.renderAs = 'number';
            scope.min = '0';
            scope.validateFn = validation.nonNegativeInteger;
            break;

          case 'datetime':
            scope.fillDefaultTime = function() {
              scope.timeValue = scope.timeValue || moment().format('HH:mm:00');
            };
            // date time control has a built-in validator
            scope.dateInputInvalid = false;
            scope.timeInputInvalid = false;
            scope.$watch('dateValue', function(newVal, oldVal) {
              scope.dateInputInvalid =
                angular.isUndefined(newVal) && !angular.isUndefined(oldVal);
              scope.invalid = scope.dateInputInvalid || scope.timeInputInvalid;
              if (newVal) {
                scope.value = newVal + (scope.timeValue ? 'T' + scope.timeValue : '');
              }
            });
            scope.$watch('timeValue', function(newVal, oldVal) {
              scope.timeInputInvalid =
                angular.isUndefined(newVal) && !angular.isUndefined(oldVal);
              scope.invalid = scope.dateInputInvalid || scope.timeInputInvalid;
              if (newVal) {
                scope.value = (scope.dateValue ? scope.dateValue + 'T' : '') + newVal;
              }
            });
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
          scope.pristine = !angular.isNumber(value) && (value || '').length === 0;
          scope.invalid =
            (angular.isFunction(scope.validateFn) && !scope.validateFn(value)) ||
            (attrs.required && scope.pristine);
        });
      }
    };
  }])
;