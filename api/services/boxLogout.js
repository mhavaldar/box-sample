var request = require('request');
var jwt = require('jwt-simple');
var config = require('./config.js');

module.exports = function (req, res) {
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
};

