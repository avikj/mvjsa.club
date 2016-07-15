var express = require('express');
var router = express.Router();
var BlogPost = require('../models/blogPost.js');

router.get('/', function(req, res, next) {
  res.redirect('/admin/review_posts');
})

router.get('/review_posts', function(req, res, next) {
  BlogPost.find({ status: 'pending' })
    .populate('author')
    .exec(function(err, pendingBlogPosts) {
      if(err) {
        console.error(err);
        return res.sendStatus(520);
      }
      res.render('admin', { user: req.user, currentView: 'member', pendingBlogPosts: pendingBlogPosts, state: 'review_posts' });
    });
});

router.get('/manage_points', function(req, res, next) {
  BlogPost.find({ status: 'pending' })
    .populate('author')
    .exec(function(err, pendingBlogPosts) {
      if(err) {
        console.error(err);
        return res.sendStatus(520);
      }
      res.render('admin', { user: req.user, currentView: 'member', pendingBlogPosts: pendingBlogPosts, state: 'manage_points' });
    });
});

module.exports = router;