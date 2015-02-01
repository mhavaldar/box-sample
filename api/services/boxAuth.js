var User = require('../models/User.js');
var request = require('request');
var createSendToken = require('./jwt.js');
var config = require('./config.js');


module.exports = function (req, res) {
  console.log('auth callback - ' + JSON.stringify(req.body));

  var emailid = req.body.email;

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    code: req.body.code,
    grant_type: 'authorization_code',
    client_secret: config.BOX_SECRET
  }

  var url = 'https://app.box.com/api/oauth2/token';
  var userInfoUrl = config.BOX_API_BASE_URL + 'users/me';

  request.post(url, {json: true, form: params}, function (err, response, token) {
    console.log('token - ' + JSON.stringify(token));

    var headers = {
      Authorization: 'Bearer ' + token.access_token
    };

    request.get({
      url: userInfoUrl, headers: headers, json: true
    }, function (err, response, boxUser) {
      if (err) throw err;
      console.log('boxUser - ' + JSON.stringify(boxUser));

      var localUser = new User();
      localUser.boxId = boxUser.id;
      localUser.email = boxUser.login;
      localUser.displayName = boxUser.name;
      localUser.accessToken = token.access_token;
      localUser.refreshToken = token.refresh_token;

      createSendToken(localUser, res);

    });
  });
};
