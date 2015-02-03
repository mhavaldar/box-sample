'use strict';

angular.module('psJwtApp').service('auth', function ($http, API_URL, authToken, $state, $window, $q) {

  function authSuccessful(res) {
    authToken.setToken(res.token);
    $state.go('main');
  }

  this.login = function (email, password) {
    return $http.post(API_URL + 'login', {
      email: email,
      password: password
    }).success(authSuccessful);
  };

  this.register = function (email, password) {
    return $http.post(API_URL + 'register', {
      email: email,
      password: password
    }).success(authSuccessful);
  };

//  var urlBuilder = [];
////  Google OAuth2
//  var OAUTH2_PARAMS = {
//    clientId: '763699622880-rq9g0k8qfkv42bfs4pv3i9cvlddmpcba.apps.googleusercontent.com',
//    authUrl: 'https://accounts.google.com/o/oauth2/auth?'
//  };
//
//  urlBuilder.push('response_type=code',
//    'client_id=' + OAUTH2_PARAMS.clientId,
//    'redirect_uri=' + window.location.origin,
//    'scope=profile email');
//
//  this.googleAuth = function () {
//    var url = OAUTH2_PARAMS.authUrl + urlBuilder.join('&');
//
//    var options = 'width=500, height=500, left=' + ($window.outerWidth - 500) / 2 + ', top=' + ($window.outerHeight - 500) / 2.5;
//
//    var deferred = $q.defer();
//
//    var popup = $window.open(url, '', options);
//    $window.focus();
//
//    $window.addEventListener('message', function(event){
//      if(event.origin === $window.location.origin){
//        var code = event.data;
//        popup.close();
//
//        $http.post(API_URL + 'auth/google', {
//          code: code,
//          clientId: OAUTH2_PARAMS.clientId,
//          redirectUri: $window.location.origin
//        }).success(function(jwt) {
//          authSuccessful(jwt);
//          deferred.resolve(jwt);
//        });
//      }
//    });
//
//    return deferred.promise;
//  };
});
