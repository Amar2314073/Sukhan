const Comment = require('../models/comment');
const Poem = require('../models/poem');


exports.getPoemComments = async (req, res) => {
  try {
    const { poemId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      poem: poemId,
      parentComment: null
    })
      .populate("user", "name avatar")
      .populate({
        path: "replies",
        populate: { path: "user", select: "name avatar" }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ comments });

  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      message: "Failed to fetch comments"
    });
  }
};

exports.postComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { poemId, content, parentComment } = req.body;

    if (!poemId || !content?.trim()) {
      return res.status(400).json({
        message: "Poem and comment content are required"
      });
    }

    const poem = await Poem.findById(poemId);
    if (!poem) {
      return res.status(404).json({
        message: "Poem not found"
      });
    }

    const comment = await Comment.create({
      poem: poemId,
      user: userId,
      content: content.trim(),
      parentComment: parentComment || null
    });

    if (!parentComment) {
      await Poem.findByIdAndUpdate(
        poemId,
        { $inc: { commentCount: 1 } }
      );
    }

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "name avatar");

    res.status(201).json({
      comment: populatedComment,
      message: parentComment
        ? "Reply added successfully"
        : "Comment posted successfully"
    });

  } catch (error) {
    console.error("Post comment error:", error);
    res.status(500).json({
      message: "Failed to post comment"
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    const isOwner = comment.user.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to delete this comment"
      });
    }

    await Comment.deleteMany({
      parentComment: comment._id
    });

    await Comment.deleteOne({
      _id: comment._id
    });

    if (!comment.parentComment) {
      await Poem.findByIdAndUpdate(
        comment.poem,
        { $inc: { commentCount: -1 } }
      );
    }

    res.json({
      message: "Comment and all replies deleted successfully"
    });

  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({
      message: "Failed to delete comment"
    });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Comment content is required"
      });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    const isOwner = comment.user.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to update this comment"
      });
    }

    comment.content = content.trim();
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate('user', 'name avatar');

    res.json({
      comment: updatedComment,
      message: "Comment updated successfully"
    });

  } catch (error) {
    console.error("Update comment error:", error);
    res.status(500).json({
      message: "Failed to update comment"
    });
  }
};

