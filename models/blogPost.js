var mongoose = require('mongoose');
var shortId = require('shortid');
var blogPostSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortId.generate
  },
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
  },
  urlString: String
});

module.exports = mongoose.model('BlogPost', blogPostSchema);