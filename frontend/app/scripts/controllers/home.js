'use strict';

angular.module('psJwtApp')
  .controller('HomeCtrl', function ($scope, $http, $stateParams, alert, API_URL) {

    var url = API_URL + 'api/folders/' + ($stateParams.folderId || 0);
    console.log('apiURL = ' + url);

    $http.get(url).success(function (folderItems) {
      $scope.folderItems = folderItems;
      $scope.hasData = folderItems.total_count > 0;
    }).error(function () {
      console.log('Unable to fetch folder items');
    });


    $scope.showFile = function (fileId) {
      alert('success', 'Box File', 'about to open the box file... ' + fileId, 4000);


      var url = API_URL + 'api/files/' + fileId;
      console.log('apiURL = ' + url);

      $http.get(url).success(function (fileData) {
        $scope.fileData = fileData;
        console.log(fileData);
      }).error(function () {
        console.log('Unable to fetch file content');
      });
    };

  });
