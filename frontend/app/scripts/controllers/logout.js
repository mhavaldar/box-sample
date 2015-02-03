'use strict';
angular.module('psJwtApp')
  .controller('LogoutCtrl', function ($auth, $state) {

/*
    // this is not working... will investigate later
    // first release box access token
    var url = API_URL + 'auth/box/logout';
    console.log('box logout url: ' + url);

    $http.get(url).success(function () {
      alert('success', 'box token destroyed');
    }).error(function () {
      alert('warning', 'something went wrong');
    });
*/

    $auth.logout();
    $state.go('login');
    $state.apply();
  });
