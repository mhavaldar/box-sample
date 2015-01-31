var jwt = require('jwt-simple');
var moment = require('moment');

module.exports = function (user, res) {
  var payload = {
    sub: user.id,
    exp: moment().add(10, 'days').unix(),
    access_token: user.accessToken,
    refresh_token: user.refreshToken
  }

  var token = jwt.encode(payload, "shhhhh...");

  res.status(200).send({
    user: user.toJSON(), token: token
  });
}
