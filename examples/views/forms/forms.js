/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */

angular.module('examples')

  .config(['$stateProvider',
    function($stateProvider) {
      'use strict';

      $stateProvider
        .state('forms', {
          url: '/forms/forms',
          templateUrl: 'views/forms/forms.html',
          controller: 'FormsCtrl'
        });
    }])

  .controller('FormsCtrl', ['$scope', '$dialogs', function($scope, $dialogs) {
    'use strict';

    $scope.age = 20;
    $scope.gender = 'male';
    $scope.genders = {male: 'Male', female: 'Female'};
    $scope.haveDriveLicense = true;
    $scope.bloodType = 'a';
    $scope.bloodTypes = {a: 'Type A', b: 'Type B', ab: 'Type AB', o: 'Type O'};
    $scope.favoriteColorChoices = ['Blue', 'Green', 'Black', 'Pink', 'Red'];
    $scope.nations = {china: 'China', germany: 'Germany', france: 'France', usa: 'United States', japan: 'Japan'};
    $scope.inputChoices = _.times(4, function(i) {
      return {
        text: 'This is choice ' + (i + 1),
        icon: 'glyphicon glyphicon-bookmark'
      };
    });

    $scope.reset = function() {
      $dialogs.confirm('Do you want to reset to default?', function() {
        console.info('Reset');
      });
    }
  }])
;