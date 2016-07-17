var express = require('express');
var router = express.Router();
var BlogPost = require('../models/blogPost');
var Event = require('../models/event');
var User = require('../models/user');

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
      res.render('admin_review_posts', { user: req.user, currentView: 'member', pendingBlogPosts: pendingBlogPosts });
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
      res.render('admin_manage_points', { user: req.user, currentView: 'member', events: events});
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

router.post('/event/:eventId/delete', function(req, res, next) {
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

router.get('/event/:eventId/edit', function(req, res, next) {
  Event
    .findOne({ _id: req.params.eventId })
    .exec(function(err, event) {
      if(err) {
        console.error(err);
        return res.send(520);
      }
      User.find({}, function(err, users) {
        if(err) {
          console.error(err);
          return res.send(520);
        }
        users.sort(function(a, b) {
          return -(b.lname.localeCompare(a.lname) || b.fname.localeCompare(a.fname));
        });
        users.forEach(function(user) {
          user.didAttend = false;
          event.attendees.forEach(function(attendee) {
            if(user._id.toString() == attendee.user.toString()) {
              user.didAttend = true;
            }
          });
        });
        res.render('admin_edit_event', { user: req.user, currentView: 'member', event: event, members: users });
      });
    });
});

router.post('/event/:eventId/edit', function(req, res, next) {
  Event.update({ _id: req.params.eventId }, {
    $set: {
      name: req.body.name,
      type: req.body.type,
      attendees: req.body.attendees.map(function(user) {
        return {
          user: user,
          points: 1
        };
      })
    }
  }, function(err, numAffected) {
    if(err) {
      console.error(err);
      res.sendStatus(404);
    } else if(numAffected == 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;