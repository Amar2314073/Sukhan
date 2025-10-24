const mongoose = require('mongoose');
const { Schema } = mongoose;


const favoriteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  poem: {
    type: Schema.Types.ObjectId,
    ref: 'Poem',
    required: [true, 'Poem reference is required']
  },
  poemType: {
    type: String,
    enum: ['sher', 'ghazal', 'nazm', 'kitaa', 'other'],
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique likes
favoriteSchema.index({ user: 1, poem: 1 }, { unique: true });

const Favorite = mongoose.model('favorite', favoriteSchema);
module.exports = Favorite;