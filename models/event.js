var mongoose = require('mongoose');
var eventSchema = new mongoose.Schema({
  name: String,
  createdAt: Date,
  type: {
    type: String,
    enum: ['meeting', 'conference', 'speaker']
  },
  attendees: [{
    points: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
});

eventSchema.methods.getType = function() {
  switch(this.type) {
    case 'meeting':
      return 'Meeting';
    case 'conference':
      return 'Conference';
    case 'speaker':
      return 'Guest Speaker';
  }
}

module.exports = mongoose.model('Event', eventSchema);