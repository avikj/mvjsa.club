var express = require('express');
var router = express.Router();

var isAuthenticated = require('../passport/isAuthenticated');
var BlogPost = require('../models/blogPost')

router.get('/', function(req, res, next) {
  BlogPost.find({/*status: 'accepted'*/})
    .populate('author')
    .exec(function(err, blogPosts) {
      res.render('blog', { user: req.user, currentView: 'blog', blogPosts: blogPosts });
    });
});

router.get('/new', isAuthenticated, function(req, res, next) {
  res.render('blog_new', { user: req.user, currentView: 'blog_new'})
});

router.post('/new', isAuthenticated, function(req, res, next) {
  var newBlogPost = new BlogPost({
    title: req.body.postTitle,
    body: req.body.postBody,
    createdAt: Date.now(),
    author: req.user._id,
    comments: [],
    status: 'pending'
  });

  newBlogPost.save(function(err) {
    if(err) {
      res.sendStatus(520);
      throw err;
    } else {
      res.sendStatus(200);
    }
  });
});

router.get('/:postId', function(req, res, next) {
  BlogPost.findOne({_id: req.params.postId})
    .populate('author')
    .populate('comments.author')
    .exec(function(err, blogPost) {
      if(err) {
        res.sendStatus(520);
        throw err;
      } else {
        res.render('blog_post', { user: req.user, currentView: 'blog_post', blogPost: blogPost});
      }
    });
});

module.exports = router;
