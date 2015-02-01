'use strict';

angular.module('psJwtApp')
  .controller('HomeCtrl', function ($scope, $http, $stateParams, API_URL, alert) {
    console.log('folderId = ' + $stateParams.folderId);
    var url = API_URL + 'api/folder/' + ($stateParams.folderId || 0);
    console.log('apiURL = ' + url);
    $http.get(url).success(function (rootFolder) {
      $scope.rootFolder = rootFolder;
    }).error(function () {
      alert('warning', 'Unable to fetch root folder details');
    });
  });
