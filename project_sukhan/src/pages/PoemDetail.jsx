import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPoemById, clearCurrentPoem } from '../redux/slices/poemSlice';

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

  if (loading) return <p className="p-6">Loading poem…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!currentPoem) return null;

  const content = currentPoem.content?.[lang];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* 🔹 Title */}
      <h1 className="text-3xl font-serif text-center mb-2">
        {currentPoem.title}
      </h1>

      {/* 🔹 Poet */}
      {currentPoem.poet && (
        <p className="text-center text-gray-600 mb-6">
          by{' '}
          <Link
            to={`/poets/${currentPoem.poet._id}`}
            className="text-amber-700 hover:underline"
          >
            {currentPoem.poet.name}
          </Link>
        </p>
      )}

      {/* 🔹 Language Toggle */}
      <div className="flex justify-center gap-3 mb-8">
        {['urdu', 'hindi', 'roman'].map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-4 py-1 rounded border text-sm
              ${lang === l
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-700'
              }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 🔹 Poem Text */}
      <pre
        className={`whitespace-pre-wrap text-lg leading-relaxed text-center
          ${lang === 'urdu' ? 'font-rekhta text-right' : ''}
        `}
      >
        {content}
      </pre>
    </div>
  );
};

export default PoemDetail;
