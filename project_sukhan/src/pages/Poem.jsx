import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import {
  fetchPoemsByCategory,
  clearPoemsByCategory
} from '../redux/slices/poemSlice';
import { getAllCategories } from '../redux/slices/categorySlice';

const Poems = () => {
  const dispatch = useDispatch();

  const { poemsByCategory, loading } = useSelector(state => state.poems);
  const { categories } = useSelector(state => state.categories);
  const navigate = useNavigate();

  const [activeCategoryId, setActiveCategoryId] = useState(null);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  /* ================= DEFAULT CATEGORY ================= */
  useEffect(() => {
    if (categories?.categories?.length && !activeCategoryId) {
      const first = categories.categories[0];
      setActiveCategoryId(first._id);
      dispatch(fetchPoemsByCategory(first._id));
    }
  }, [categories, activeCategoryId, dispatch]);

  /* ================= CHANGE CATEGORY ================= */
  const changeCategory = (catId) => {
    setActiveCategoryId(catId);
    dispatch(clearPoemsByCategory());
    dispatch(fetchPoemsByCategory(catId)); // ✅ STRING ONLY
  };

  return (
    <div className="bg-base-100 min-h-screen text-base-content">

      {/* ================= CATEGORY TABS ================= */}
      <div className="border-b border-base-300/40 sticky top-0 bg-base-100 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto text-sm font-medium">
            {categories?.categories?.map(cat => (
              <button
                key={cat._id}
                onClick={() => changeCategory(cat._id)}
                className={`
                  py-4 whitespace-nowrap border-b-2 transition
                  ${activeCategoryId === cat._id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-base-content/60 hover:text-base-content'}
                `}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= POEMS ================= */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {loading && (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-base-200 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && poemsByCategory.length === 0 && (
          <p className="text-center text-base-content/60">
            कोई रचना उपलब्ध नहीं है
          </p>
        )}

        <div className="space-y-6">
          {poemsByCategory.map(poem => {
            const misre = poem.content?.hindi
              ?.split('\n')
              .filter(Boolean)
              .slice(0, 2);

            return (
              <div
                key={poem._id}
                onClick={() => navigate(`/poems/${poem._id}`)}
                className="
                  cursor-pointer
                  relative
                  rounded-2xl
                  px-7 py-6
                  bg-base-200/90
                  hover:bg-base-200/10
                  transition
                "
              >
                {/* shimmer shine */}
                <div className="
                  absolute inset-0 pointer-events-none
                  bg-gradient-to-r
                  from-transparent
                  via-white/5
                  to-transparent
                " />

                {/* lines */}
                {misre?.map((line, i) => (
                  <p
                    key={i}
                    className="font-serif text-lg leading-relaxed"
                  >
                    {line}
                  </p>
                ))}

                {/* poet */}
                {poem.poet && (
                  <p className="mt-3 text-sm text-base-content/60">
                    — by{' '}
                    <span
                      onClick={e => { 
                        e.stopPropagation();
                        navigate(`/poets/${poem.poet._id}`);
                      }}
                      className="hover:text-primary cursor-pointer underline-offset-2 hover:underline"
                    >
                      {poem.poet.name}
                    </span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Poems;
