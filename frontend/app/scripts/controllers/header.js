'use strict';

angular.module('psJwtApp')
  .controller('HeaderCtrl', function ($rootScope, $scope, $auth, $state, alert) {
    $scope.isAuthenticated = $auth.isAuthenticated;
    var userName = '';
    if ($auth.getPayload()) {
      userName = $auth.getPayload().displayName;
    }
    $rootScope.userName = userName;

    $scope.authenticate = function (provider) {
      $auth.authenticate(provider).then(function (res) {
        $rootScope.userName = res.data.user.displayName;
        $state.reload();
      }, handleError);
    };

    function handleError(err) {
      alert('warning', 'Something went wrong : (' + err.message + ')');
    }

  });
