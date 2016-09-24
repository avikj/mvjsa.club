'use strict'
var mongoose = require('mongoose');
var Event = require('./event');
var BlogPost = require('./blogPost');
var userSchema = new mongoose.Schema({
  email: String,
  password: String,
  fname: String,
  lname: String,
  grade: Number,
  sid: Number,
  dob: String,
  phone: String,
  paid: Boolean,
  isAdmin: Boolean,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  }
});

userSchema
  .virtual('fullName')
  .get(function() {
    return this.fname+' '+this.lname;
  });

userSchema.methods.getActivityPoints = function(cb) {
  let currentUser = this;
  Event.find({}, function(err, events) {
    if(err) {
      return cb(err);
    }
    var totalPoints = 0;
    var attendedEvents = [];

    // for each event, search attendees to see if the user attended;
    // if so, add the appropriate number of activity points
    events.forEach(function(event) {
      event.attendees.forEach(function(attendee) {
        if(attendee.user.toString() == currentUser._id.toString()) {
          totalPoints += attendee.points;
          attendedEvents.push({ event: event, points: attendee.points });
        }
      });
    });

    // for each accepted blog post submitted by the cuser, add 5 activity points
    BlogPost.find({ author: currentUser._id, status: 'accepted' }, function(err, blogPosts) {
      if(!err && blogPosts) {
        totalPoints += blogPosts.length * 5;
      }
      cb(null, totalPoints, attendedEvents);
    });
  });
}

module.exports = mongoose.model('User', userSchema);