var mongoose = require('mongoose');
var blogPostSchema = new mongoose.Schema({
  title: String,
  body: String,
  createdAt: Date,
  publishedAt: Date,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    body: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  status: {
    type: String,
    enum: ['accepted', 'rejected', 'pending']
  }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);