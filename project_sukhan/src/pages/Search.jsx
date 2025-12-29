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

  const { searchResults: poemResults, searchLoading: poemLoading } =
    useSelector(state => state.poems);

  const { searchResults: poetResults, searchLoading: poetLoading } =
    useSelector(state => state.poets);

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
      <h1 className="text-2xl font-serif mb-6">
        Search results for “{q}”
      </h1>

      {loading && (
        <p className="text-base-content/60 mb-6">Searching…</p>
      )}

      {/* ================= POETS (HORIZONTAL SCROLL) ================= */}
      {!loading && poetResults.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-serif mb-4">Poets</h2>

          <div className="overflow-x-auto pb-2">
            <div className="flex gap-4 w-max">
              {poetResults.map(poet => (
                <div key={poet._id} className="w-[140px] shrink-0">
                  <PoetCard poet={poet} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= POEMS (VERTICAL SCROLL) ================= */}
      {!loading && poemResults.length > 0 && (
        <section>
          <h2 className="text-xl font-serif mb-4">Poems</h2>

          <div
            className="
              space-y-5
              max-h-[60vh]
              overflow-y-auto
              pr-2
            "
          >
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
