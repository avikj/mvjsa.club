var express = require('express');
var router = express.Router();

module.exports = function(passport) {
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { user: req.user, currentView: 'index' });
  });

  router.get('/join', function(req, res, next) {
    res.render('join', { user: req.user, currentView: 'join' });
  });

  router.get('/about', function(req, res, next) {
    res.render('about', { user: req.user, currentView: 'about' });
  });

  router.get('/members', function(req, res, next) {
    if(req.user) {
      res.render('member_portal', { user: req.user, currentView: 'members' });
    } else {
      res.render('members_login', { user: req.user, currentView: 'members' });
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
