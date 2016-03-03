/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */
angular.module('dashing.dialogs', [
  'mgcrea.ngStrap.modal'
])
/**
 * A dialog factory that to create modal dialogs.
 *
 * @example
 *  In script:
 *    $dialogs.confirm('Do you want to delete this item?', function() {
 *      console.log('User wants to delete this item');
 *    });
 */
  .factory('$dialogs', ['$modal', 'dashing.i18n', function($modal, i18n) {
    'use strict';

    function createModalDialog(options, onClose) {
      var modalCloseEventName = 'modal.onclose';
      var dialog = $modal(angular.merge({
        show: true,
        backdrop: 'static',
        controller: ['$scope', function($scope) {
          $scope.text = options.text;
          $scope.close = function(modalValue) {
            $scope.$emit(modalCloseEventName, {modalValue: modalValue});
            $scope.$hide();
          }
        }]
      }, options));

      dialog.$scope.$on(modalCloseEventName, function(_, values) {
        onClose(values.modalValue);
      });
      return dialog;
    }

    return {
      confirm: function(text, onConfirm) {
        var options = {
          templateUrl: 'dialogs/confirmation.html',
          title: i18n.confirmationDialogTitle,
          text: {
            yesButton: i18n.confirmationYesButtonText,
            noButton: i18n.confirmationNoButtonText
          },
          content: text
        };
        var handleCloseFn = function(modalValue) {
          if (modalValue > 0) {
            onConfirm();
          }
        };
        createModalDialog(options, handleCloseFn);
      }
    };
  }])
;