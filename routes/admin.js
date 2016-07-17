var express = require('express');
var router = express.Router();
var BlogPost = require('../models/blogPost');
var Event = require('../models/event');

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
  Event.find({})
    .populate('attendees')
    .sort({ _id: -1 })
    .exec(function(err, events) {
      if(err) {
        console.error(err);
        return res.sendStatus(520);
      }
      res.render('admin', { user: req.user, currentView: 'member', events: events, state: 'manage_points' });
    });
});

router.post('/manage_points/new_event', function(req, res, next) {
  var newEvent = new Event({
    name: req.body.name,
    type: req.body.type,
    createdAt: new Date()
  });
  newEvent.save(function(err) {
    if(err) {
      res.sendStatus(520);
    } else {
      res.sendStatus(200);
    }
  });
});

router.post('/event/:eventId/delete', function(req,res, next) {
  Event
    .find({ _id: req.params.eventId })
    .remove(function(err) {
      if(err) {
        res.sendStatus(520);
      } else {
        res.sendStatus(200);
      }
  });
});

module.exports = router;