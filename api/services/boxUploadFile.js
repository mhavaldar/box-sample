var request = require('request');
var jwt = require('jwt-simple');
var config = require('./config.js');

module.exports = function (req, res) {

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
}
