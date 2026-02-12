import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import PoemCard from '@/components/PoemCard';
import {
  fetchPoemsByCategory,
  clearPoemsByCategory
} from '@/redux/slices/poemSlice';
import { getAllCategories } from '@/redux/slices/categorySlice';

const Poems = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.categories);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const observerRef = useRef(null);
  const { poemsByCategory, loading, currentPage, totalPages } =
  useSelector(state => state.poems);


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
      setPage(1);
      dispatch(fetchPoemsByCategory({
      categoryId: first._id,
      page: 1
      }));
    }
  }, [categories, activeCategoryId, dispatch]);

  /* ================= CHANGE CATEGORY ================= */
  const changeCategory = (catId) => {
    setActiveCategoryId(catId);
    setPage(1);
    dispatch(clearPoemsByCategory());
    dispatch(fetchPoemsByCategory({
      categoryId: catId,
      page: 1
    }));
  };

  useEffect(() => {
    if (loading) return;
    if (currentPage >= totalPages) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && currentPage < totalPages) {
          setPage(prev => prev + 1);
        }
      },
      { rootMargin: '300px' }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loading, currentPage, totalPages]);

  useEffect(() => {
    if (!activeCategoryId) return;
    if (page === 1) return;

    dispatch(fetchPoemsByCategory({
      categoryId: activeCategoryId,
      page
    }));
  }, [page, activeCategoryId, dispatch]);



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
            Sometimes Silence is also a sher.<br />No poems found in this category.
          </p>
        )}

        <div className="space-y-6">
          {poemsByCategory.map(poem => (
            <PoemCard key={poem._id} poem={poem} />
          ))}
        </div>

        {currentPage < totalPages && (
          <div ref={observerRef} className="h-6" />
        )}
      </div>
    </div>
  );
};

export default Poems;
