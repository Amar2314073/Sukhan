const mongoose = require('mongoose');
const { Schema } = mongoose;

const statSchema = new Schema({
  _id: {
    type: String,
    default: 'GLOBAL_STATS'
  },
  poems: {
    type: Number,
    default: 0,
  },
  poets: {
    type: Number,
    default: 0,
  },
  collections: {
    type: Number,
    default: 0,
  },
  users: {
    type: Number,
    default: 0
  },
  languages: {
    type: Number,
    default: 2,
  },
  literaryEras: {
    type: Number,
    default: 3,
  },
}, {
  timestamps: true
});

const Stat =  mongoose.model("stat", statSchema);
module.exports = Stat;