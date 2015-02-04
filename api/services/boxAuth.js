var User = require('../models/User.js');
var request = require('request');
var createSendToken = require('./jwt.js');
var config = require('./config.js');
var jwt = require('jwt-simple');


module.exports.auth = function (req, res) {
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
}

module.exports.logout = function (req, res) {
  console.log('destroying box token...');
  if (!req.headers.authorization) {
    console.log('no authorization header');
    return res.status(200).send({
      message: 'Not logged in!'
    });
  }
  ;

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, config.JWT_SECRET);

  console.log('payload...');
  console.log(payload);

  if (!payload.access_token) {
    console.log('no access token present');
    res.status(200).send({
      message: 'No access token present!'
    });
  }

  var headers = {
    Authorization: 'Bearer ' + payload.access_token
  };

  var formValues = {
    client_id: config.BOX_CLIENT_ID,
    client_secret: config.BOX_SECRET,
    token: payload.access_token
  };

  request.post({
    url: config.BOX_OAUTH2_REVOKE_URL, headers: headers, form: formValues
  }, function (err, response, boxresp) {
    if (err) throw err;

    console.log(JSON.stringify(boxresp));
    res.status(200).send({
      message: 'successfully revoked box token!'
    });
  });
}

