import { useState } from 'react';
import CommentForm from '../components/CommentForm';
import { commentService } from '../services/comment.service';

const CommentItem = ({ comment, reload }) => {
  const [showReplies, setShowReplies] = useState(false);

  const deleteComment = async () => {
    await commentService.deleteComment(comment._id);
    reload();
  };

  return (
    <div className="border-l pl-4">
      <div className="flex gap-3">
        <img
          src={comment.user.avatar}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <p className="font-medium">{comment.user.name}</p>
          <p className="text-sm">{comment.content}</p>

          <div className="flex gap-4 mt-1 text-xs text-base-content/60">
            <button onClick={() => setShowReplies(!showReplies)}>
              Reply
            </button>
            <button onClick={deleteComment}>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* REPLIES */}
      {showReplies && (
        <div className="ml-10 mt-4 space-y-4">
          {comment.replies?.map(reply => (
            <CommentItem
              key={reply._id}
              comment={reply}
              reload={reload}
            />
          ))}

          <CommentForm
            poemId={comment.poem}
            parentComment={comment._id}
            onSuccess={reload}
          />
        </div>
      )}
    </div>
  );
};

export default CommentItem;
