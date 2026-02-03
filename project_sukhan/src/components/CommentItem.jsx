import { Trash2 } from 'lucide-react';
import { commentService } from '../services/comment.service';

const CommentItem = ({ comment, onReply, reload }) => {
  const deleteComment = async () => {
    await commentService.deleteComment(comment._id);
    reload();
  };

  return (
    <div className="space-y-3">

      {/* MAIN COMMENT */}
      <div className="flex gap-3">
        <img
          src={comment.user.avatar}
          className="w-8 h-8 rounded-full"
        />

        <div>
          <p className="text-sm font-medium">
            {comment.user.name}
          </p>
          <p className="text-sm opacity-90">
            {comment.content}
          </p>

          <div className="flex gap-4 mt-1 text-xs text-base-content/60">
            <button onClick={() => onReply(comment)}>Reply</button>
            <button onClick={deleteComment}>
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* REPLIES */}
      {comment.replies?.length > 0 && (
        <div className="ml-10 space-y-3">
          {comment.replies.map(reply => (
            <div key={reply._id} className="flex gap-3">
              <img
                src={reply.user.avatar}
                className="w-7 h-7 rounded-full"
              />
              <div>
                <p className="text-xs font-medium">
                  {reply.user.name}
                </p>
                <p className="text-xs opacity-90">
                  {reply.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default CommentItem;
