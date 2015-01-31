var request = require('request');
var qs = require('querystring');
var createSendToken = require('./jwt.js');
var config = require('./config.js');
var User = require('../models/User.js');

module.exports = function (req, res) {
  var accessTokenUrl = 'https://graph.facebook.com/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/me';

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    client_secret: config.FACEBOOK_SECRET,
    code: req.body.code
  };

  request.get({
    uri: accessTokenUrl,
    qs: params
  }, function (err, response, accessToken) {
    accessToken = qs.parse(accessToken);

    console.log(accessToken);

    request.get({
      url: graphApiUrl,
      qs: accessToken, json: true
    }, function (err, response, profile) {
      console.log(profile);

      User.findOne({
        facebookId: profile.id
      }, function (err, foundUser) {

        console.log("here");

        if (foundUser) return createSendToken(foundUser, res);

        var newUser = new User();
        newUser.facebookId = profile.id;
        newUser.displayName = profile.name;
        newUser.save(function (err) {
          if (err) return next(err);
          createSendToken(newUser, res);
        })
      })
    })
  })
}