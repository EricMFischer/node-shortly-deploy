var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');
// In mongo, models are collections. So we can delete these and the folder collections

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Links.reset().fetch().then(function(links) {
    res.send(200, links.models);
  })
};

exports.saveLink = function(req, res) { // refactor
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  // new Link({ url: uri }).fetch().then(function(found) {
  Link.findOne({url: uri}).exec(function(err, found) { // mongoose callbacks conform to Node fn signature with err parameter coming first
    if (found) {
      res.send(200, found); // instead of found.attributes
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin,
          visits: 0 // added here
        });

        link.save().then(function(err, newLink) { // cb again conforms to node fn signature
          if (err) {res.send(500, err)
          } else {
            // Links.add(newLink); no longer necessary because there's no distinction between models and collections in mongoose
            res.send(200, newLink);
          }
        });
      });
    }
  });
};

exports.loginUser = function(req, res) { // refactor
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }).exec(function(err, user) {
      if (!user) {
        res.redirect('/login');
      } else {
        user.comparePassword(password, function(err, match) { // changed comparePassword in Users so have to change it here too
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        })
      }
  });
};

exports.signupUser = function(req, res) { // refactor
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
    .exec(function(user) {
      if (!user) {
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.save(function(err, newUser) {
          if (err) {res.send(500, err);}
          else {util.createSession(req, res, newUser);}
          // Users.add(newUser); no distinctions between models and collections in mongoose
        });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) { // refactor
  Link.findOne({ code: req.params[0] }).exec(function(err, link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits++;
      // link.set({ visits: link.get('visits') + 1 }) don't use getters/setters in mongoose
        .save()
        .then(function(err, link) {
          return res.redirect(link.url);
        });
    }
  });
};


