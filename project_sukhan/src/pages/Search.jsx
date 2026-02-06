import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router';
import { globalSearch, clearGlobalSearch } from '../redux/slices/globalSearchSlice';

import PoetCard from '../components/PoetCard';
import PoemCard from '../components/PoemCard';
import BookCard from '../components/BookCard';

const Search = () => {
  const [params] = useSearchParams();
  const q = params.get('q');

  const dispatch = useDispatch();
  const { poets, poems, books, collections, loading } =
    useSelector(state => state.globalSearch);

  useEffect(() => {
    if (!q) return;
    dispatch(clearGlobalSearch());
    dispatch(globalSearch(q));
  }, [q, dispatch]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      <h1 className="text-2xl font-serif mb-6">
        Search results for “{q}”
      </h1>

      {loading && <p className="opacity-60">Searching…</p>}

      {/* ===== POETS ===== */}
      {!loading && poets.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-serif mb-4">Poets</h2>
          <div className="flex gap-4 overflow-x-auto">
            {poets.map(poet => (
              <div key={poet._id} className="w-[140px] shrink-0">
                <PoetCard poet={poet} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== POEMS ===== */}
      {!loading && poems.length > 0 && (
        <section className="mb-10 h-90 overflow-y-auto">
          <h2 className="text-xl font-serif mb-4">Poems</h2>
          <div className="space-y-4">
            {poems.map(poem => (
              <PoemCard key={poem._id} poem={poem} />
            ))}
          </div>
        </section>
      )}

      {/* ===== BOOKS ===== */}
      {!loading && books.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-serif mb-4">Books</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {books.map(book => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* ===== EMPTY ===== */}
      {!loading &&
        poets.length === 0 &&
        poems.length === 0 &&
        books.length === 0 && (
          <p className="opacity-60">No results found.</p>
        )}
    </div>
  );
};

export default Search;
