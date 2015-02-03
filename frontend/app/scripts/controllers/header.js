'use strict';

angular.module('psJwtApp')
  .controller('HeaderCtrl', function ($rootScope, $scope, $auth, alert) {
    $scope.isAuthenticated = $auth.isAuthenticated;
    var userName = '';
    if ($auth.getPayload()) {
      userName = $auth.getPayload().displayName;
    }
    $rootScope.userName = userName;

    $scope.authenticate = function (provider) {
      $auth.authenticate(provider).then(function (res) {
        $rootScope.userName = res.data.user.displayName;
        //alert('success', 'Welcome', 'Thanks for coming back ' + res.data.user.displayName + '!', 4000);
      }, handleError);
    };

    function handleError(err) {
      alert('warning', 'Something went wrong : (' + err.message + ')');
    }

  });
