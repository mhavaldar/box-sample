var request = require('request');
var jwt = require('jwt-simple');
var config = require('./config.js');
var https = require('https');

module.exports.getFileViewer = function (req, res) {

  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'You are not authroized!'
    });
  }

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, config.JWT_SECRET);

  if (!payload.access_token) {
    res.status(401).send({
      message: 'Authentication failed'
    });
  }

  // get temporary file location
  var options = {
    host: 'api.box.com',
    path: '/2.0/files/' + req.params.id + '/content',
    headers: {
      Authorization: 'Bearer ' + payload.access_token
    }
  }

  var httpsReq = https.request(options, function (httpsRes) {

    var loc = httpsRes.headers.location;
    console.log("location: ", loc);

    // generate HTML5 document
    /*
     curl https://view-api.box.com/1/documents \
     -H "Authorization: Token jspw1fi10zivi180yg3p9mqkruwv6bnt" \
     -H "Content-type: application/json" \
     -d '{"url": "https://dl.boxcloud.com/bc/*"}' \
     -X POST
     */

    var httpsReq2 = https.request({
      host: 'api.box.com',
      path: '/1/documents',
      method: 'POST',
      headers: {
        Authorization: 'Token ' + config.BOX_API_KEY,
        'content-type': 'application/json'
      }
    }, function (httpsRes2) {
      //console.log("headers: " + httpsRes2.headers);

      var respString = '';

      httpsRes2.on('data', function (d) {
        respString += d;
      });

      httpsRes2.on('end', function () {
        console.log('<<<<<<<<<<< file generation string');
        console.log(respString);
        console.log('file generation string >>>>>>>>>>>>');

        // return respone to the client
        res.json(respString);
      });
    });
    httpsReq2.write('{"url": "' + loc + '"}');
    httpsReq2.end();

    httpsReq2.on('error', function (e) {
      console.error('Error at httpsReq2');
      console.error(e);
    });

    httpsRes.on('data', function (d) {
      //process.stdout.write(d);
    });
  });
  httpsReq.end();

  httpsReq.on('error', function (e) {
    console.log('Error at first req');
    console.error(e);
  });

};


module.exports.uploadFile = function (req, res) {

  var parentId = '';
  var formBody = req.body;
  for (var k in formBody) {
    parentId += formBody[k];
  }
  console.log('parentId: ' + parentId);
  console.log("req.files >>>>>>>>");
  console.log(req.files);

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


  /*
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
   */
};

module.exports.deleteFile = function (req, res) {

  var fileId = req.params.id;
  console.log('fileId: ' + fileId);

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
    'Authorization': 'Bearer ' + payload.access_token
  };

  var url = 'https://api.box.com/2.0/files/' + fileId;

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
