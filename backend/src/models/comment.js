const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    poem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'poem',
      required: true,
      index: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },

    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment',
      default: null
    },

    likesCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

/* ================= VIRTUAL REPLIES ================= */
commentSchema.virtual('replies', {
  ref: 'comment',
  localField: '_id',
  foreignField: 'parentComment'
});

/* ================= ENABLE VIRTUALS ================= */
commentSchema.set('toObject', { virtuals: true });
commentSchema.set('toJSON', { virtuals: true });

/* ================= INDEXES ================= */
commentSchema.index({ poem: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;
