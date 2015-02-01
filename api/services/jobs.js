var jwt = require('jwt-simple');
var config = require('./config.js');

module.exports = function (req, res) {
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

  if (!payload.sub) {
    res.status(401).send({
      message: 'Authentication failed'
    });
  }
  res.json(jobs);
};

var jobs = [
  'Cook',
  'SuperHero',
  'Unicorn Wisperer',
  'Toast Inspector'
];
