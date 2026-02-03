import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import { commentService } from '../services/comment.service';

const CommentSheet = ({ open, onClose, poemId }) => {
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const loadComments = async () => {
    const res = await commentService.getPoemComments(poemId);
    setComments(res.data.comments || []);
  };

  useEffect(() => {
    if (open) loadComments();
  }, [open]);

  if (!open) return null;

  /* ================= DRAG HANDLERS ================= */

  const onTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const onTouchEnd = () => {
    const diff = currentY.current - startY.current;

    if (diff > 120) {
      onClose();
    } else {
      sheetRef.current.style.transform = 'translateY(0)';
    }
  };

  return (
    <div className="fixed inset-0 z-50">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* SHEET */}
      <div
        ref={sheetRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`
          absolute bottom-0 inset-x-0
          bg-gray-900
          rounded-t-2xl
          flex flex-col
          transition-transform duration-300
          ${expanded ? 'h-full' : 'h-[70vh]'}
        `}
      >

        {/* DRAG HANDLE */}
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 rounded bg-gray-600" />
        </div>

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
          <h3 className="font-medium">
            Comments ({comments.length})
          </h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* COMMENTS */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-6"
          onScroll={() => setExpanded(true)}
        >
          {comments.map(comment => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onReply={setReplyTo}
              reload={loadComments}
            />
          ))}
        </div>

        {/* INPUT */}
        <CommentInput
          poemId={poemId}
          replyTo={replyTo}
          clearReply={() => setReplyTo(null)}
          onSuccess={() => {
            setReplyTo(null);
            loadComments();
          }}
        />
      </div>
    </div>
  );
};

export default CommentSheet;
