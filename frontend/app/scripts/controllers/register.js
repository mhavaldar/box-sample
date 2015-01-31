'use strict';

angular.module('psJwtApp')
  .controller('RegisterCtrl', function ($scope, alert, auth) {
    $scope.submit = function() {
      auth.register($scope.email, $scope.password)
        .success(function(res) {
          alert('success', 'Account Created!', 'Welcome, ' + res.user.email + '!', 4000);
        })
        .error(function(err) {
          alert('warning', 'Opps!', 'Could not register');
        });
    }
  });
