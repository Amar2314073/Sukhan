import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link, useNavigate } from 'react-router';
import { searchPoems, clearSearchResults } from '../redux/slices/poemSlice';
import { searchPoets } from '../redux/slices/poetSlice';

const Search = () => {
  const [params] = useSearchParams();
  const q = params.get('q');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showShimmer, setShowShimmer] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const { searchResults: poemResults, searchLoading: poemLoading } =
    useSelector(state => state.poems);

  const { searchResults: poetResults, searchLoading: poetLoading } =
    useSelector(state => state.poets);

  /* ---------- FIRE SEARCH ---------- */
  useEffect(() => {
    if (!q) return;
    dispatch(clearSearchResults());
    dispatch(searchPoems(q));
    dispatch(searchPoets(q));
  }, [q, dispatch]);

  const loading = poemLoading || poetLoading;

  /* ---------- REDIRECT LOGIC ---------- */
  useEffect(() => {
    if (loading) return;

    if (poetResults.length === 1) {
      setRedirecting(true);      // 🔑 stop normal UI
      setShowShimmer(true);

      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          navigate(`/poets/${poetResults[0]._id}`, { replace: true });
        }, 350);
      }, 900);
    }
  }, [loading, poetResults, navigate]);

  /* ---------- SHIMMER ONLY ---------- */
  if (showShimmer) {
    return (
      <div className={`container mx-auto px-4 py-24 fade-in ${fadeOut ? 'fade-out' : ''}`}>
        <div className="max-w-4xl mx-auto space-y-10">

          <div className="h-10 w-2/3 rounded shimmer"></div>

          <div className="flex items-center gap-8">
            <div className="w-28 h-28 rounded-full shimmer"></div>
            <div className="flex-1 space-y-4">
              <div className="h-6 w-1/2 rounded shimmer"></div>
              <div className="h-4 w-1/3 rounded shimmer"></div>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <div className="h-4 w-full rounded shimmer"></div>
            <div className="h-4 w-11/12 rounded shimmer"></div>
            <div className="h-4 w-10/12 rounded shimmer"></div>
          </div>

          <div className="space-y-5 mt-10">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-6 w-full rounded shimmer"></div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  /* ---------- BLOCK UI DURING REDIRECT ---------- */
  if (redirecting) return null;

  /* ---------- NORMAL SEARCH UI ---------- */
  return (
    <div className="container mx-auto px-4 py-8">

      <h1 className="text-2xl font-serif mb-6">
        Search results for “{q}”
      </h1>

      {/* ⛔ searching text only when NOT redirecting */}
      {loading && <p className="text-gray-500">Searching…</p>}

      {poetResults.length > 0 && (
        <>
          <h2 className="text-xl mb-3 font-semibold">Poets</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {poetResults.map(poet => (
              <Link
                key={poet._id}
                to={`/poets/${poet._id}`}
                className="p-4 border rounded hover:bg-amber-50 transition"
              >
                <div className="font-semibold">{poet.name}</div>
                <div className="text-sm text-gray-500">{poet.era}</div>
              </Link>
            ))}
          </div>
        </>
      )}

      {poemResults.length > 0 && (
        <>
          <h2 className="text-xl mb-3 font-semibold">Poems</h2>
          <div className="space-y-4">
            {poemResults.map(poem => (
              <Link
                key={poem._id}
                to={`/poems/${poem._id}`}
                className="block p-4 border rounded hover:bg-amber-50 transition"
              >
                <p className="italic line-clamp-2">
                  {poem.content?.hindi || poem.content?.roman}
                </p>
                {poem.poet && (
                  <p className="text-sm text-gray-600 mt-1">
                    — {poem.poet.name}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </>
      )}

      {!loading && poetResults.length === 0 && poemResults.length === 0 && (
        <p className="text-gray-500">No results found.</p>
      )}
    </div>
  );
};

export default Search;
