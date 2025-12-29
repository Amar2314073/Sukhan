import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router';
import { searchPoems, clearSearchResults } from '../redux/slices/poemSlice';
import { searchPoets } from '../redux/slices/poetSlice';

import PoetCard from '../components/PoetCard';
import PoemCard from '../components/PoemCard';

const Search = () => {
  const [params] = useSearchParams();
  const q = params.get('q');

  const dispatch = useDispatch();

  const {
    searchResults: poemResults,
    searchLoading: poemLoading
  } = useSelector(state => state.poems);

  const {
    searchResults: poetResults,
    searchLoading: poetLoading
  } = useSelector(state => state.poets);

  const loading = poemLoading || poetLoading;

  /* ================= FIRE SEARCH ================= */
  useEffect(() => {
    if (!q) return;

    dispatch(clearSearchResults());
    dispatch(searchPoems(q));
    dispatch(searchPoets(q));
  }, [q, dispatch]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* ================= HEADING ================= */}
      <h1 className="text-2xl font-serif mb-8">
        Search results for “{q}”
      </h1>

      {/* ================= LOADING ================= */}
      {loading && (
        <p className="text-base-content/60">
          Searching…
        </p>
      )}

      {/* ================= POETS ================= */}
      {!loading && poetResults.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-serif mb-4">
            Poets
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {poetResults.map(poet => (
              <PoetCard key={poet._id} poet={poet} />
            ))}
          </div>
        </section>
      )}

      {/* ================= POEMS ================= */}
      {!loading && poemResults.length > 0 && (
        <section>
          <h2 className="text-xl font-serif mb-4">
            Poems
          </h2>

          <div className="space-y-5">
            {poemResults.map(poem => (
              <PoemCard key={poem._id} poem={poem} />
            ))}
          </div>
        </section>
      )}

      {/* ================= NO RESULTS ================= */}
      {!loading &&
        poetResults.length === 0 &&
        poemResults.length === 0 && (
          <p className="text-base-content/60">
            No results found.
          </p>
        )}
    </div>
  );
};

export default Search;
