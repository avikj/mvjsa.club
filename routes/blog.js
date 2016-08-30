var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var isAuthenticated = require('../passport/isAuthenticated');
var isAdmin = require('../passport/isAdmin');
var BlogPost = require('../models/blogPost')

var toUrlFriendlyString = require('../utils/toUrlFriendlyString');
router.get('/', function(req, res, next) {
  BlogPost.find({status: 'accepted'})
    .populate('author')
    .sort({ _id: -1 })
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
    createdAt: new Date(),
    author: req.user._id,
    comments: [],
    status: 'pending',
    urlString: toUrlFriendlyString(req.body.postTitle)
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

router.get('/pending/:postId', isAdmin, function(req, res, next) {
  BlogPost.findOne({_id: req.params.postId, status: 'pending'})
    .populate('author')
    .populate('comments.author')
    .exec(function(err, blogPost) {
      if(blogPost){
        res.render('blog_post', { user: req.user, currentView: 'blog_post', blogPost: blogPost});
      } else {
        next();
      }
    });
});

router.post('/pending/:postId/accept', isAdmin, function(req, res, next) {
  BlogPost.update({ _id: req.params.postId }, { $set: { status: 'accepted', publishedAt: new Date() } }, function(err) {
    res.redirect('/member');
  });
});

router.post('/pending/:postId/reject', isAdmin, function(req, res, next) {
  BlogPost.update({ _id: req.params.postId }, { $set: { status: 'rejected' } }, function(err) {
    res.redirect('/member');
  });
});
router.get('/:postId', function(req, res, next) {
  res.redirect(`/blog/${req.params.postId}/-`)
});
router.get('/:postId/:urlString', function(req, res, next) {
  BlogPost.findOne({_id: req.params.postId, status: 'accepted'})
    .populate('author')
    .populate('comments.author')
    .exec(function(err, blogPost) {
      if(blogPost) {
        if(blogPost.urlString != req.params.urlString) {
          res.redirect(`/blog/${blogPost._id}/${blogPost.urlString}`);
        }
        var $ = cheerio.load(blogPost.body);
        var ogImage = $('img')[0] ? ($('img').attr('src')) : null;
        res.render('blog_post', { user: req.user, currentView: 'blog_post', blogPost: blogPost, title: blogPost.title+' - MV JSA', ogImage: ogImage});
      } else {
        next(); // forward request to 404 handler
      }
    });
});

module.exports = router;
