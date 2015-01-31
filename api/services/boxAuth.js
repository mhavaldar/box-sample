var User = require('../models/User.js');
var request = require('request');
var createSendToken = require('./jwt.js');
var config = require('./config.js');


module.exports = function (req, res) {
  console.log(req.body);

  var emailid = req.body.email;

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    code: req.body.code,
    grant_type: 'authorization_code',
    client_secret: config.BOX_SECRET
  }

  var url = 'https://app.box.com/api/oauth2/token';
  var folderUrl = 'https://www.box.com/api/2.0/folders/0';

  request.post(url, {json: true, form: params}, function (err, response, token) {
    console.log(token);

    //var returnToken =
    //{
    //  access_token: '8dCRJjU2zi8BzfQ4Tma3D5mkEEltX3kK',
    //  expires_in: 4040,
    //  restricted_to: [],
    //  refresh_token: 'D3g9qiTFstsqnEXBWI9rGyDgwvxGnYQ0CLRi3el51D1EW6jwAtpir9J8fb3mEKLM',
    //  token_type: 'bearer'
    //}

    var accessToken = token.access_token;
    var headers = {
      Authorization: 'Bearer ' + accessToken
    };

    request.get({
      url: folderUrl, headers: headers, json: true
    }, function (err, response, folders) {
      if (err) console.log(err.message);

      console.log('folders...');
      console.log(JSON.stringify(folders));
      User.findOne({
        email: 'manju.havaldar@outlook.com'
      }, function (err, foundUser) {

        console.log("here");

        if (foundUser) return createSendToken(foundUser, res);

        var newUser = new User();
        newUser.email = 'manju.havaldar@outlook.com';
        newUser.password = 'a';
        newUser.save(function (err) {
          if (err) return next(err);
          createSendToken(newUser, res);
        })
      });
    });
  })
}