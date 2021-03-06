var express = require('express');
var router = express.Router();
var BlogPost = require('../models/blogPost');
var Event = require('../models/event');
var User = require('../models/user');
var async = require('async');
var exec = require('child_process').exec;
var config = require('../config');
var path = require('path');
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
      User.find({}, function(err, users) {
        if(err) {
          console.error(err);
          return res.sendStatus(520);
        }
        var asyncTasks = [];
        users.forEach(function(user) {
          asyncTasks.push(function(callback) {
            user.getActivityPoints(function(err, result) {
              user.activityPoints = result;
              callback();
            });
          });
        });
        async.parallel(asyncTasks, function() {
          users.sort(function(a, b) {
            return b.activityPoints - a.activityPoints;
          });
          res.render('admin_manage_points', { user: req.user, currentView: 'member', events: events, users: users });
        });
      }); 
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
          user.points = 0;
          event.attendees.forEach(function(attendee) {
            if(user._id.toString() == attendee.user.toString()) {
              user.didAttend = true;
              user.points = attendee.points;
            }
          });
        });
        res.render('admin_edit_event', { user: req.user, currentView: 'member', event: event, members: users });
      });
    });
});

router.post('/event/:eventId/edit', function(req, res, next) {
  Event.findById(req.params.eventId, function(err, event) {
    if(err) {
      console.error(err);
      return res.sendStatus(520);
    } 
    if(event.type == 'meeting') {
      event.attendees = req.body.attendees;
    } else {
      event.attendees = req.body.attendees.map(function(user) {
        return {
          user: user,
          points: event.maxPoints
        };
      });
    }
    event.save(function(err) {
      if(err) {
        res.sendStatus(520);
      } else {
        res.sendStatus(200);
      }
    });
  });
});


router.get('/userdata', function(req, res, next) {
  var command = 'mongoexport --host localhost --db mvjsa --collection users --csv  --fields fname,lname,email,phone,sid,gender --out data.csv';
  if(process.env.OPENSHIFT_MONGODB_DB_HOST)
    command = 'mongoexport --host $OPENSHIFT_MONGODB_DB_HOST --username $OPENSHIFT_MONGODB_DB_USERNAME --password $OPENSHIFT_MONGODB_DB_PASSWORD --db mvjsa --collection users --csv  --fields fname,lname,email,phone,sid,gender --out data.csv';
  exec(command, function(err, stdout, stderr) {
    if(err) {
      res.send(err);
    }
    res.sendFile(path.join(__dirname,'..', 'data.csv'));
  });
});

module.exports = router;