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

    $scope.radio = 7;
    $scope.radioChoices = {7: 'Past 7 days', 30: 'Past 30 days'};
    $scope.radio2 = 'a';
    $scope.radioChoices2 = {a: 'Class A', b: 'Class B', c: 'Class C'};

    $scope.$watch('radio', function(val) {
      console.log(val);
    });
  }])
;