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

  .controller('FormsCtrl', ['$scope', function($scope) {
    'use strict';

    $scope.age = 20;
    $scope.gender = 'male';
    $scope.genders = {male: 'Male', female: 'Female'};
    $scope.haveDriveLicense = true;
    $scope.bloodType = 'a';
    $scope.bloodTypes = {a: 'Type A', b: 'Type B', ab: 'Type AB', o: 'Type O'};
    $scope.favoriteColorChoices = ['Blue', 'Green', 'Black'];
    $scope.nations = {china: 'China', germany: 'Germany', france: 'France', usa: 'United States', japan: 'Japan'};
  }])
;