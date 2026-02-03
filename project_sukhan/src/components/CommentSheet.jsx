import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import { commentService } from '../services/comment.service';

const CommentSheet = ({ open, onClose, poemId }) => {
  const sheetRef = useRef(null);
  const startYRef = useRef(0);
  const draggingRef = useRef(false);

  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [translateY, setTranslateY] = useState(100); // %

  /* ================= LOAD COMMENTS ================= */
  const loadComments = async () => {
    const res = await commentService.getPoemComments(poemId);
    setComments(res.data.comments || []);
  };

  /* ================= OPEN / CLOSE ANIMATION ================= */
  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => {
        setTranslateY(0); // slide up
      });
      loadComments();
    } else {
      setTranslateY(100); // slide down
      setTimeout(() => setMounted(false), 300);
    }
  }, [open]);

  if (!mounted) return null;

  /* ================= DRAG HANDLERS ================= */
  const onTouchStart = (e) => {
    draggingRef.current = true;
    startYRef.current = e.touches[0].clientY;
    sheetRef.current.style.transition = 'none';
  };

  const onTouchMove = (e) => {
    if (!draggingRef.current) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;

    if (diff > 0) {
      const percent = (diff / window.innerHeight) * 100;
      setTranslateY(Math.min(percent, 100));
    }
  };

  const onTouchEnd = () => {
    draggingRef.current = false;
    sheetRef.current.style.transition = 'transform 0.3s ease';

    if (translateY > 30) {
      setTranslateY(100);
      setTimeout(onClose, 300);
    } else {
      setTranslateY(0);
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
        className="
          absolute bottom-0 inset-x-0
          h-[70vh]
          bg-gray-900
          rounded-t-2xl
          flex flex-col
          touch-none
        "
        style={{
          transform: `translateY(${translateY}%)`,
          transition: 'transform 0.3s ease'
        }}
      >

        {/* DRAG HANDLE */}
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 rounded bg-gray-600" />
        </div>

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h3 className="font-medium">
            Comments ({comments.length})
          </h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* COMMENTS LIST */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {comments.map(comment => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onReply={setReplyTo}
              reload={loadComments}
            />
          ))}
        </div>

        {/* INPUT (FIXED BOTTOM) */}
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
