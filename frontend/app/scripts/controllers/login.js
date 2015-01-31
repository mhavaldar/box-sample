'use strict';

angular.module('psJwtApp')
  .controller('LoginCtrl', function ($scope, alert, auth) {
    $scope.submit = function () {
      auth.login($scope.email, $scope.password)
        .success(function (res) {
          alert('success', 'Welcome', 'Thanks for coming back ' + res.user.email + '!', 4000);
        })
        .error(handleError);
    }

    $scope.google = function () {
      auth.googleAuth().then(function (res) {
        alert('success', 'Welcome', 'Thanks for coming back ' + res.user.displayName + '!', 4000);
      }, handleError);
    }

    function handleError(err) {
      alert('warning', 'Something went wrong : (' + err.message + ')');
    }
  });
