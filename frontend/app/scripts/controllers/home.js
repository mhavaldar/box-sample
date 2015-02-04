'use strict';

angular.module('psJwtApp')
  .controller('HomeCtrl', function ($scope, $http, $stateParams, $auth, alert, $state, FileUploader, API_URL) {
    var folderId = $stateParams.folderId || '0';
    var url = API_URL + 'api/folders/' + folderId;
    $scope.isAuthenticated = $auth.isAuthenticated;
    $scope.folderId = folderId;
    $scope.folderItems = {};
    if (!$scope.breadcrumb) {
      $scope.breadcrumb = {route: [{folderId: '0', folderName: 'Root'}]};
    }

    $http.get(url).success(function (folderItems) {
      $scope.folderItems = folderItems;
      console.log(folderId);
      //$rootScope.breadcrumb.route.push({folderId: folderId, folderName: folderId});
    }).error(function () {
      console.log('Unable to fetch folder items');
    });

    var uploader = $scope.uploader = new FileUploader({
      url: API_URL + 'api/uploadFile',
      headers: {
        Authorization: 'Bearer ' + $auth.getToken()
      },
      formData: {parentId: folderId}
    });

    // FILTERS
    uploader.filters.push({
      name: 'customFilter',
      fn: function (item /*{File|FileLikeObject}*/, options) {
        return this.queue.length < 10;
      }
    });

    //// CALLBACKS
    //uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
    //  console.info('onWhenAddingFileFailed', item, filter, options);
    //};
    //
    //uploader.onAfterAddingFile = function(fileItem) {
    //  console.info('onAfterAddingFile', fileItem);
    //};
    //uploader.onAfterAddingAll = function(addedFileItems) {
    //  console.info('onAfterAddingAll', addedFileItems);
    //};
    //uploader.onBeforeUploadItem = function(item) {
    //  console.info('onBeforeUploadItem', item);
    //};
    //uploader.onProgressItem = function(fileItem, progress) {
    //  console.info('onProgressItem', fileItem, progress);
    //};
    //uploader.onProgressAll = function(progress) {
    //  console.info('onProgressAll', progress);
    //};
    //uploader.onSuccessItem = function(fileItem, response, status, headers) {
    //  console.info('onSuccessItem', fileItem, response, status, headers);
    //};
    //uploader.onErrorItem = function(fileItem, response, status, headers) {
    //  console.info('onErrorItem', fileItem, response, status, headers);
    //};
    //uploader.onCancelItem = function(fileItem, response, status, headers) {
    //  console.info('onCancelItem', fileItem, response, status, headers);
    //};
    //uploader.onCompleteItem = function(fileItem, response, status, headers) {
    //  console.info('onCompleteItem', fileItem, response, status, headers);
    //};
    //uploader.onCompleteAll = function() {
    //  console.info('onCompleteAll');
    //};

    console.info('uploader', uploader);

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
    }

    $scope.createFolder = function () {
      var url = API_URL + 'api/createFolder'
      var data = {
        parentId: ($scope.folderId || '0'), folderName: ($scope.folderName || 'New Folder')
      };

      console.log(JSON.stringify(data));

      $http.post(url, data).success(function () {
        $state.reload();
      }).error(function () {
        console.log('Unable to create folder');
      });
    };

    $scope.uploadFile = function (files) {
      alert('success', 'Upload File', 'about to upload a new file for {parent_id:' + ($scope.folderId || '0') + '}', 3000);
      var fd = new FormData();
      fd.append("file", files[0]);

      var uploadUrl = API_URL + 'api/uploadFile';

      $http.post(uploadUrl, fd, {
        withCredentials: true,
        headers: {'Content-Type': undefined},
        transformRequest: angular.identity
      }).success(function () {
        console.log('success');
        $state.reload();
      }).error(function () {
        console.log('error');
      });
    };

    $scope.downloadFile = function (fileId) {
      alert('success', 'Download File', 'about to download file {fileId: ' + fileId + '}', 3000);

      var url = API_URL + 'api/files/' + itemId;
      console.log(url);

      $http.delete(url).success(function () {
        $state.reload();
      }).error(function () {
        console.log('Unable to delete ' + type + ' id: ' + itemId);
      });
    };

    $scope.deleteItem = function (type, itemId, etag) {
      var url = API_URL + 'api/' + type + 's/' + itemId;
      console.log(url);

      $http.delete(url).success(function () {
        $state.reload();
      }).error(function () {
        console.log('Unable to delete ' + type + ' id: ' + itemId);
      });

    }


  });
