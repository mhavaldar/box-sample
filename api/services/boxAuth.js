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
  var userInfoUrl = 'https://www.box.com/api/2.0/users/me';

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
      url: userInfoUrl, headers: headers, json: true
    }, function (err, response, userInfo) {
      if (err) console.log(err.message);

      console.log('folders...');
      console.log(JSON.stringify(userInfo));

      User.findOne({
        boxId: userInfo.id
      }, function (err, foundUser) {

        console.log(token);
        foundUser.accessToken = accessToken;
        foundUser.refreshToken = token.refresh_token;

        if (foundUser) return createSendToken(foundUser, res);

        var newUser = new User();
        newUser.boxId = userInfo.id;
        //newUser.email = userInfo.login;
        newUser.displayName = userInfo.name;

        newUser.save(function (err) {
          if (err) return next(err);
          createSendToken(newUser, res);
        })
      });
    });
  })
}