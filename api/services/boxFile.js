var request = require('request');
var jwt = require('jwt-simple');
var config = require('./config.js');
var https = require('https');

module.exports = function (req, res) {

  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'You are not authroized!'
    });
  }

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, config.JWT_SECRET);

  //console.log('payload...');
  //console.log(payload);
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

  var httpsReq = https.request(options, function(httpsRes) {

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

      httpsRes2.on('data', function(d) {
        respString += d;
      });

      httpsRes2.on('end', function() {
        console.log('<<<<<<<<<<< file generation string');
        console.log(respString);
        console.log('file generation string >>>>>>>>>>>>');

        // return respone to the client
        res.json(respString);
      });
    });
    httpsReq2.write('{"url": "' + loc + '"}');
    httpsReq2.end();

    httpsReq2.on('error', function(e) {
      console.error('Error at httpsReq2');
      console.error(e);
    });

    httpsRes.on('data', function(d) {
      //process.stdout.write(d);
    });
  });
  httpsReq.end();

  httpsReq.on('error', function(e) {
    console.log('Error at first req');
    console.error(e);
  });

};
