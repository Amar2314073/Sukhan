import { useRef, useEffect, useState } from 'react';

const AutoFitMisra = ({ text, lang, onWordClick }) => {
  const ref = useRef(null);
  const [fontSize, setFontSize] = useState(20); // starting size

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let size = fontSize;

    // shrink until it fits in one line
    while (el.scrollWidth > el.clientWidth && size > 12) {
      size -= 1;
      el.style.fontSize = size + 'px';
    }
  }, [text]);

  return (
    <div
      ref={ref}
      className={`
        w-full overflow-hidden whitespace-nowrap
        ${lang === 'urdu' ? 'text-right font-rekhta' : 'text-center'}
      `}
      style={{ fontSize }}
    >
      {text.split(' ').map((word, i) => (
        <span
          key={i}
          onClick={() => onWordClick(word)}
          className="cursor-pointer"
        >
          {word}{' '}
        </span>
      ))}
    </div>
  );
};

export default AutoFitMisra;
