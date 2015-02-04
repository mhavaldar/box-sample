var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var googleAuth = require('./services/googleAuth.js');
var facebookAuth = require('./services/facebookAuth.js');
var boxAuth = require('./services/boxAuth.js');
var boxFolders = require('./services/boxFolders.js');
var boxFiles = require('./services/boxFiles.js');
//var boxUploadFile = require('./services/boxUploadFile.js');
var createSendToken = require('./services/jwt.js');
var multer = require('multer');

//var mongoose = require('mongoose');
//var LocalStrategy = require('./services/localStrategy.js');
//var jobs = require('./services/jobs.js');

var app = express();
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(multer({dest: '../../uploads/'}));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

//passport.use('local-login', LocalStrategy.login);
//passport.use('local-register', LocalStrategy.register);
app.post('/register', passport.authenticate('local-register'), function (req, res) {
  createSendToken(req.user, res);
});
app.post('/login', passport.authenticate('local-login'), function (req, res) {
  createSendToken(req.user, res);
});

app.post('/auth/facebook', facebookAuth);
app.post('/auth/google', googleAuth);

app.post('/auth/box', boxAuth.auth);
app.get('/auth/box/logout', boxAuth.logout);

app.get('/api/folders/:id?', boxFolders.getFolder);
app.post('/api/createFolder', boxFolders.createFolder);
app.delete('/api/folders/:id?', boxFolders.deleteFolder);

app.get('/api/files/:id?', boxFiles.getFileViewer);
app.post('/api/uploadFile', boxFiles.uploadFile);
app.delete('/api/files/:id?', boxFiles.deleteFile);

var server = app.listen(3000, function () {
  console.log('api listening on ', server.address().port);
});

//mongoose.connect('mongodb://localhost/psjwt');
//app.get('/jobs', jobs);
