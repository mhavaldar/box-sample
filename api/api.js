/**
 * Created by MHavaldar on 1/30/2015.
 */
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/User.js');
var jwt = require('jwt-simple');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');

//Google OAuth2 parameters
var OAUTH2_PARAMS = {
  clientSecret: 'G9jsj0U95FcmIxfTyc_yAJC4',
  authTokenUrl: 'https://accounts.google.com/o/oauth2/token',
  userInfoUrl: 'https://www.googleapis.com/plus/v1/people/me/openIdConnect'

}

//Box OAuth2 parameters
//var OAUTH2_PARAMS = {
//    clientSecret: 'STPtQ0S8qliagFckGHL6gOiICXSFFRry',
//    authTokenUrl: 'https://app.box.com/api/oauth2/token',
//    userInfoUrl: 'https://www.box.com/api/2.0/folders/0'
//}

var app = express();
app.use(bodyParser.json());
app.use(passport.initialize());

passport.serializeUser(function (user, done) {
  done(null, user.id);
})

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
})
var strategyOptions = {
  usernameField: 'email'
}
var loginStrategy = new LocalStrategy(strategyOptions, function (email, password, done) {
  var searchUser = {
    email: email
  };

  User.findOne(searchUser, function (err, user) {
    if (err) return done(err);

    if (!user)
      return done(null, false, {message: 'Wrong email/password'});

    user.comparePasswords(password, function (err, isMatch) {
      if (err) return done(err);

      if (!isMatch)
        return done(null, false, {message: 'Wrong email/password'});

      return done(null, user);
    });
  })
});

var registerStrategy = new LocalStrategy(strategyOptions, function (email, password, done) {
  var newUser = new User({
    email: email,
    password: password
  });
  var searchUser = {
    email: email
  };

  User.findOne(searchUser, function (err, user) {
    if (err) return done(err);

    if (user)
      return done(null, false, {message: 'email already exists'});

    newUser.save(function (err) {
      done(null, newUser)
    })
  });
});

passport.use('local-login', loginStrategy);
passport.use('local-register', registerStrategy);

app.post('/register', passport.authenticate('local-register'), function (req, res) {
  createSendToken(req.user, res);
})

app.post('/login', passport.authenticate('local-login'), function (req, res) {
  createSendToken(req.user, res);
})

function createSendToken(user, res) {
  var payload = {
    sub: user.id
  }

  var token = jwt.encode(payload, "shhhhh...");

  res.status(200).send({
    user: user.toJSON(), token: token
  });
}

var jobs = [
  'Cook',
  'SuperHero',
  'Unicorn Wisperer',
  'Toast Inspector'
];

app.get('/jobs', function (req, res) {
  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'You are not authroized!'
    });
  }

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, "shhhhh...");

  if (!payload.sub) {
    res.status(401).send({
      message: 'Authentication failed'
    });
  }
  res.json(jobs);
})

app.post('/auth/google', function (req, res) {
  console.log(req.body.code);

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    code: req.body.code,
    grant_type: 'authorization_code',
    client_secret: OAUTH2_PARAMS.clientSecret
  }

  request.post(OAUTH2_PARAMS.authTokenUrl, {json: true, form: params}, function (err, response, token) {
    console.log(token);
    var accessToken = token.access_token;
    var headers = {
      Authorization: 'Bearer ' + accessToken
    };

    request.get({
      url: OAUTH2_PARAMS.userInfoUrl, headers: headers, json: true
    }, function (err, response, profile) {
      if (err) console.log(err.message);
      User.findOne({
        googleId: profile.sub
      }, function (err, foundUser) {

        console.log("here");

        if (foundUser) return createSendToken(foundUser, res);

        var newUser = new User();
        newUser.googleId = profile.sub;
        newUser.displayName = profile.name;
        newUser.save(function (err) {
          if (err) return next(err);
          createSendToken(newUser, res);
        })
      })
    });
  })
})
mongoose.connect('mongodb://localhost/psjwt');

var server = app.listen(3000, function () {
  console.log('api listening on ', server.address().port);
})