var express = require('express');
var session = require('express-session');
var FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;
var fitbitConfig = require('../config/fitbit.js');
var passport = require('passport');
var app = express();
var path = require('path');

var storedAccessToken;

app.use(session({ secret: 'keyboard cat' }));

app.use(passport.initialize());
app.use(passport.session({
  resave: false,
  saveUninitialized: true
}));

const CLIENT_ID = fitbitConfig.clientId;
const CLIENT_SECRET = fitbitConfig.clientSecret;

var fitbitStrategy = new FitbitStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  scope: ['activity','heartrate','location','profile'],
  callbackURL: "http://localhost:8030/auth/callback"
}, function(accessToken, refreshToken, profile, done) {
  // TODO: save accessToken here for later use

  done(null, {
    accessToken: accessToken,
    refreshToken: refreshToken,
    profile: profile
  });

});

passport.use(fitbitStrategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var fitbitAuthenticate = passport.authenticate('fitbit', {
  successRedirect: '/auth/success',
  failureRedirect: '/auth/failure'
});

app.get('/auth', function (req, res){
  if( req.user ){
    //show logout
    res.sendFile(path.join(__dirname + '/logout.html'));
  }
  else{
    res.sendFile(path.join(__dirname + '/login.html'));
  }
});
app.post('/auth', fitbitAuthenticate);
app.post('/auth/logout', function (req, res){
  req.logout();
  res.redirect('/auth');
});

app.get('/auth/callback', fitbitAuthenticate);

app.get('/auth/failure', function (req, res){
  res.send('NOT AUTHED');
});

app.get('/auth/success', function(req, res) {
  res.send(req.user);
});

app.get('/test', function(req, res, next){
  if( !req.user ){
    res.redirect('/auth');
  }
  else{
    res.send('Authed!');
  }
});

app.listen(8030);