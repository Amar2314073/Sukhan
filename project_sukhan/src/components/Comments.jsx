import { useEffect, useState } from 'react';
import { commentService } from '../services/comment.service';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

const Comments = ({ poemId }) => {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadComments();
  }, [poemId]);

  const loadComments = async () => {
    const res = await commentService.getPoemComments(poemId);
    setComments(res.data.comments);
  };

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-4">
        Comments ({comments.length})
      </h3>

      {/* NEW COMMENT */}
      <CommentForm poemId={poemId} onSuccess={loadComments} />

      {/* COMMENTS LIST */}
      <div className="space-y-6 mt-6">
        {comments.map(comment => (
          <CommentItem
            key={comment._id}
            comment={comment}
            reload={loadComments}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
