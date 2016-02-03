/*
 * Licensed under the Apache License, Version 2.0
 * See accompanying LICENSE file.
 */

angular.module('examples')

  .config(['$stateProvider',
    function($stateProvider) {
      'use strict';

      $stateProvider
        .state('state', {
          url: '/state',
          templateUrl: 'views/state/state.html',
          controller: 'StateControl'
        });
    }])

  .controller('StateControl', ['$scope', function($scope) {
    'use strict';

    $scope.condition = 'good';
    $scope.text = 'This is a text of state icon';
  }])
;