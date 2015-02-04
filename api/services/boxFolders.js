var request = require('request');
var jwt = require('jwt-simple');
var config = require('./config.js');

module.exports.getFolder = function (req, res) {

  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'You are not authroized!'
    });
  }
  ;

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, config.JWT_SECRET);

  console.log('payload...');
  console.log(payload);

  if (!payload.access_token) {
    res.status(401).send({
      message: 'Authentication failed'
    });
  }

  var headers = {
    Authorization: 'Bearer ' + payload.access_token
  };

  var url = config.BOX_API_BASE_URL + 'folders/' + (req.params.id || '0') + '/items';

  console.log('boxURL:' + url);

  request.get({
    url: url, headers: headers, json: true
  }, function (err, response, folder) {
    if (err) throw err;

    console.log('Folder details')
    console.log(JSON.stringify(folder));
    res.json(folder);
  });
};

module.exports.createFolder = function (req, res) {

  console.log(req.body);
  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'You are not authroized!'
    });
  }
  ;

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, config.JWT_SECRET);

  console.log('payload...');
  console.log(payload);

  if (!payload.access_token) {
    res.status(401).send({
      message: 'Authentication failed'
    });
  }

  var newFolder = {
    name: req.body.folderName,
    parent: {
      id: req.body.parentId
    }
  };

  var headers = {
    'Authorization': 'Bearer ' + payload.access_token
  };

  var url = 'https://api.box.com/2.0/folders';

  console.log('body: ' + newFolder);

  request.post({
    url: url, headers: headers, json: true, body: newFolder
  }, function (err, response, folder) {
    if (err) throw err;

    console.log('Folder details')
    console.log(JSON.stringify(folder));
    res.json(folder);
  });
};

module.exports.deleteFolder = function (req, res) {
  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'You are not authroized!'
    });
  }
  ;

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, config.JWT_SECRET);

  //console.log('payload...');
  //console.log(payload);

  if (!payload.access_token) {
    res.status(401).send({
      message: 'Authentication failed'
    });
  }

  var headers = {
    Authorization: 'Bearer ' + payload.access_token
  };

  var url = 'https://api.box.com/2.0/folders/' + req.params.id + '?recursive=true';

  console.log('boxURL:' + url);

  request.del({
    url: url, headers: headers
  }, function (err, response) {
    if (err) throw err;

    if (response.status === '204') {
      console.log('successfully deleted');
    }
    res.json('{status: successful}');
  });
};

