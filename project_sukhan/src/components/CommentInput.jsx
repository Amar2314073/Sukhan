import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { commentService } from '../services/comment.service';

const CommentInput = ({ poemId, replyTo, clearReply, onSuccess }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;

    setLoading(true);
    await commentService.postComment({
      poemId,
      content: text,
      parentComment: replyTo?._id
    });

    setText('');
    clearReply();
    setLoading(false);
    onSuccess();
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-gray-800 px-4 py-3 bg-gray-900">

      {replyTo && (
        <div className="flex items-center justify-between text-xs mb-2 text-primary">
          Replying to {replyTo.user.name}
          <button onClick={clearReply}>
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          placeholder="Write a comment…"
          className="
            flex-1 resize-none
            bg-gray-800
            rounded-full
            px-4 py-2
            text-sm
            outline-none
          "
        />

        <button
          onClick={submit}
          disabled={loading}
          className="text-primary"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
