import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import Comments from './Comments';

const INITIAL_HEIGHT = 70; // %
const FULL_HEIGHT = 100;
const DRAG_CLOSE_THRESHOLD = 120;

const CommentSheet = ({ open, onClose, poemId }) => {
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const [height, setHeight] = useState(INITIAL_HEIGHT);
  const [dragging, setDragging] = useState(false);

  /* ================= RESET ON OPEN ================= */
  useEffect(() => {
    if (open) setHeight(INITIAL_HEIGHT);
  }, [open]);

  /* ================= DRAG START ================= */
  const onStart = (y) => {
    startY.current = y;
    setDragging(true);
  };

  /* ================= DRAG MOVE ================= */
  const onMove = (y) => {
    if (!dragging) return;

    const delta = y - startY.current;
    currentY.current = delta;

    if (delta < -40) setHeight(FULL_HEIGHT); // drag up
  };

  /* ================= DRAG END ================= */
  const onEnd = () => {
    setDragging(false);

    if (currentY.current > DRAG_CLOSE_THRESHOLD) {
      onClose();
    }

    currentY.current = 0;
  };

  if (!open) return null;

  return (
    <>
      {/* BACKDROP (30%) */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-40"
      />

      {/* SHEET */}
      <div
        ref={sheetRef}
        className="
          fixed bottom-0 left-0 right-0 z-50
          bg-gray-950
          rounded-t-3xl
          transition-all duration-300 ease-out
          touch-none
        "
        style={{ height: `${height}vh` }}
        onTouchStart={(e) => onStart(e.touches[0].clientY)}
        onTouchMove={(e) => onMove(e.touches[0].clientY)}
        onTouchEnd={onEnd}
        onMouseDown={(e) => onStart(e.clientY)}
        onMouseMove={(e) => dragging && onMove(e.clientY)}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
      >
        {/* DRAG HANDLE */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
        </div>

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 pb-3 border-b border-gray-800">
          <h3 className="text-sm font-medium text-gray-300">
            Comments
          </h3>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* COMMENTS AREA */}
        <div
          className="overflow-y-auto h-full px-4 pb-6"
          onScroll={(e) => {
            if (e.target.scrollTop > 10 && height !== FULL_HEIGHT) {
              setHeight(FULL_HEIGHT);
            }
          }}
        >
          <Comments poemId={poemId} />
        </div>
      </div>
    </>
  );
};

export default CommentSheet;
