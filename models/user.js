'use strict'
var mongoose = require('mongoose');
var Event = require('./event');
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
    var result = 0;
    events.forEach(function(event) {
      event.attendees.forEach(function(attendee) {
        if(attendee.user.toString() == currentUser._id.toString()) {
          result += attendee.points;
        }
      });
    });
    cb(null, result);
  });
}

module.exports = mongoose.model('User', userSchema);