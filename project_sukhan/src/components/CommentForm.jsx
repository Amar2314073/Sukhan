import { useState } from 'react';
import { commentService } from '../services/comment.service';

const CommentForm = ({ poemId, parentComment = null, onSuccess }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;

    setLoading(true);
    await commentService.postComment({
      poemId,
      content: text,
      parentComment
    });
    setText('');
    setLoading(false);
    onSuccess?.();
  };

  return (
    <div className="mt-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={parentComment ? 'Write a reply…' : 'Add a comment…'}
        className="w-full p-3 rounded-lg border bg-base-200"
      />
      <button
        onClick={submit}
        disabled={loading}
        className="btn btn-primary btn-sm mt-2"
      >
        {parentComment ? 'Reply' : 'Comment'}
      </button>
    </div>
  );
};

export default CommentForm;
