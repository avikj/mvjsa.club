var mongoose = require('mongoose');

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

module.exports = mongoose.model('User', userSchema);