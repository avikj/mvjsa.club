var express = require('express');
var router = express.Router();
var isAdmin = require('../passport/isAdmin');
var isAuthenticated = require('../passport/isAuthenticated');
var BlogPost = require('../models/blogPost.js');
var officers = require('../constants/officers.json');
module.exports = function(passport) {
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { user: req.user, currentView: 'index' });
  });

  router.get('/join', function(req, res, next) {
    res.render('join', { user: req.user, currentView: 'join' });
  });

  router.get('/about', function(req, res, next) {
    res.render('about', { user: req.user, currentView: 'about', officers: officers });
  });

  router.get('/login', function(req, res, next) {
    if(req.user) {
      res.redirect('/member');
    } else {
      res.render('login', { user: req.user, currentView: 'login' });
    }
  });

  router.get('/member', isAuthenticated, function(req, res, next) {
    if(req.user.isAdmin){
      res.redirect('/admin')
    } else {
      BlogPost.find({author: req.user._id})
        .populate('author')
        .populate('comments.author')
        .exec(function(err, blogPosts) {
          if(blogPosts){
            req.user.getActivityPoints(function(err, totalPoints, attendedEvents) {
              res.render('member', { user: req.user, currentView: 'member', blogPosts: blogPosts, totalPoints: totalPoints, attendedEvents: attendedEvents });
            });
          } else {
            next();
          }
        });
    }
  });
  
  /* Handle Login POST */
  router.post('/login', function(req, res, next) {
    passport.authenticate('login', function(err, user, info) {
      if (err) { 
        return res.send('failure'); 
      }
      if (!user) { 
        return res.send('nomatch'); 
      }
      req.logIn(user, function(err) {
        if (err) { 
          return next(err); 
        }
        res.send('success');
      });
    })(req, res, next);
  });

  /* Handle Registration POST */
  router.post('/signup', function(req, res, next) {
    passport.authenticate('signup', function(err, user, info) {
      if (err) { 
        console.error(err);
        return res.send('failure');
      }
      if (!user) { 
        if(info == 'registered') {
          return res.send('registered');
        }
        return res.send('failure'); 
      }
      req.logIn(user, function(err) {
        if (err) { 
          return next(err); 
        }
        res.send('success');
      });
    })(req, res, next);
  });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
  return router;
};
