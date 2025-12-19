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

  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    searchResults: poemResults,
    searchLoading: poemLoading
  } = useSelector(state => state.poems);

  const {
    searchResults: poetResults,
    searchLoading: poetLoading
  } = useSelector(state => state.poets);

  /* ---------- FIRE SEARCH ---------- */
  useEffect(() => {
    if (!q) return;

    dispatch(clearSearchResults());
    dispatch(searchPoems(q));
    dispatch(searchPoets(q));
  }, [q, dispatch]);

  const loading = poemLoading || poetLoading;

  /* ---------- AUTO REDIRECT (REKHTA STYLE) ---------- */
  useEffect(() => {
    if (loading) return;

    // Single clear poet match → go to profile directly
    if (poetResults.length === 1) {
      setIsRedirecting(true);

      setTimeout(() => {
        navigate(`/poets/${poetResults[0]._id}`);
      }, 200);
    }

    // Single poem match (optional – enable if you want)
    // else if (poemResults.length === 1 && poetResults.length === 0) {
    //   setIsRedirecting(true);
    //   setTimeout(() => {
    //     navigate(`/poems/${poemResults[0]._id}`, { replace: true });
    //   }, 200);
    // }

  }, [loading, poetResults, poemResults, navigate]);

  /* ---------- SHIMMER WHILE REDIRECTING ---------- */
  if (isRedirecting) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="h-20 bg-amber-100 rounded animate-pulse"></div>
          <div className="h-20 bg-amber-100 rounded animate-pulse"></div>
          <div className="h-20 bg-amber-100 rounded animate-pulse"></div>
          <div className="h-20 bg-amber-100 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  /* ---------- NORMAL SEARCH UI ---------- */
  return (
    <div className="container mx-auto px-4 py-8">

      <h1 className="text-2xl font-serif mb-6">
        Search results for “{q}”
      </h1>

      {loading && <p className="text-gray-600">Searching…</p>}

      {/* ---------- POETS ---------- */}
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

      {/* ---------- POEMS ---------- */}
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
        <p className="text-gray-600">No results found.</p>
      )}
    </div>
  );
};

export default Search;
