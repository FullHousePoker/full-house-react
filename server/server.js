var path = require('path');
var express = require('express');
var app = express();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var request = require('request');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'fullhouse',
  keys: ['i just want to stay', 'broke foreveer']
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy(
  {
    clientID: process.env.APP_ID,
    clientSecret: process.env.APP_SECRET,
    callbackURL: process.env.HOST + '/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name'],
  },
  function(accessToken, refreshToken, profile, done) {
    request
      .post('http://jzs-macbook.local:8080/users')
      .form({ user: profile._json })
      .on('response', function(resp) {
        resp.on('data', function(data) {
          var user = JSON.parse(data);
          user.token = accessToken;
          done(null, user);
        })
      });
  }
));

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

passport.serializeUser(function(user, done) {
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function(user, done) {
  done(null, JSON.parse(user));
});

app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, '../client/login.html'));
});

app.get('/self', function(req, res) {
  res.send(req.user);
});

app.get('/', function(req, res, next) {
  if (!req.user) {
    return res.redirect('/login');
  }
  next();
});

app.use(express.static(path.join(__dirname, '../client')));

app.listen(8080, function() {
  console.log('listening at http://localhost:8080');
});