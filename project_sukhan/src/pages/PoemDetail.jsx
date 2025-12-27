import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPoemById, clearCurrentPoem } from '../redux/slices/poemSlice';
import ChatAI from '../components/ChatAI';

const PoemDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentPoem, loading, error } = useSelector(
    state => state.poems
  );

  const [lang, setLang] = useState('hindi');

  useEffect(() => {
    dispatch(fetchPoemById(id));

    return () => {
      dispatch(clearCurrentPoem());
    };
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 p-6 text-center text-error">
        {error}
      </div>
    );
  }

  if (!currentPoem) return null;

  const content = currentPoem.content?.[lang];

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* ================= TITLE ================= */}
        <h1 className="text-3xl md:text-4xl font-serif text-center mb-2">
          {currentPoem.title}
        </h1>

        {/* ================= POET ================= */}
        {currentPoem.poet && (
          <p className="text-center text-base-content/60 mb-6">
            —{' '}
            <Link
              to={`/poets/${currentPoem.poet._id}`}
              className="hover:text-primary hover:underline underline-offset-4"
            >
              {currentPoem.poet.name}
            </Link>
          </p>
        )}

        {/* ================= LANGUAGE TOGGLE ================= */}
        <div className="flex justify-center gap-2 mb-10">
          {['urdu', 'hindi', 'roman'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`
                px-4 py-1.5 rounded-full text-xs tracking-wide
                border transition
                ${lang === l
                  ? 'bg-primary text-primary-content border-primary'
                  : 'bg-base-200 text-base-content/70 border-base-300 hover:text-base-content'}
              `}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ================= POEM CARD ================= */}
        <div
          className={`
            relative
            rounded-2xl
            px-6 md:px-10
            py-8 md:py-10
            bg-base-200/60
            shadow-lg
          `}
        >
          {/* subtle shine */}
          <div className="
            pointer-events-none absolute inset-0
            bg-gradient-to-r
            from-transparent
            via-white/5
            to-transparent
            rounded-2xl
          " />

          {/* poem text */}
          <pre
            className={`
              whitespace-pre-wrap
              text-sm
              leading-relaxed
              font-serif
              ${lang === 'urdu'
                ? 'text-right font-rekhta text-md leading-loose'
                : 'text-center'}
            `}
          >
            {content}
          </pre>
        </div>

        {/* ================= META INFO ================= */}
        {/* {(currentPoem.category || currentPoem.tags?.length) && (
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-base-content/60">
            {currentPoem.category && (
              <span className="px-3 py-1 rounded-full bg-base-200">
                {currentPoem.category.name}
              </span>
            )}
            {currentPoem.tags?.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-base-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )} */}
        
        <ChatAI poem={currentPoem} />

      </div>
    </div>
  );
};

export default PoemDetail;
