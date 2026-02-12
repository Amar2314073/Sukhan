import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  fetchCollections,
  clearCollections,
  setFilters
} from '@/redux/slices/collectionSlice';
import { getAllCategories } from '@/redux/slices/categorySlice';

const Collections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const observerRef = useRef(null);

  const { categories } = useSelector(state => state.categories);
  const {
    list,
    loading,
    pagination,
    filters
  } = useSelector(state => state.collections);

  const { currentPage, totalPages } = pagination;

  const [activeCategory, setActiveCategory] = useState(null);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    dispatch(fetchCollections({ page: 1 }));
  }, [dispatch]);

  /* ================= CATEGORY CHANGE ================= */
  const changeCategory = (catId) => {
    setActiveCategory(catId);
    dispatch(clearCollections());
    dispatch(setFilters({ category: catId }));
    dispatch(fetchCollections({ page: 1, category: catId }));
  };

  /* ================= INFINITE SCROLL ================= */
  useEffect(() => {
    if (loading || currentPage >= totalPages) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dispatch(
            fetchCollections({
              page: currentPage + 1,
              category: filters.category
            })
          );
        }
      },
      { rootMargin: '300px' }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => el && observer.unobserve(el);
  }, [loading, currentPage, totalPages, filters.category, dispatch]);

  return (
    <div className="bg-base-100 min-h-screen text-base-content">

      {/* ================= CATEGORY TABS ================= */}
      <div className="border-b border-base-300/40 sticky top-0 bg-base-100 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto text-sm font-medium">
            <button
              onClick={() => changeCategory(null)}
              className={`py-4 border-b-2 ${
                !activeCategory
                  ? 'border-primary text-primary'
                  : 'border-transparent text-base-content/60'
              }`}
            >
              All
            </button>

            {categories?.categories?.map(cat => (
              <button
                key={cat._id}
                onClick={() => changeCategory(cat._id)}
                className={`py-4 border-b-2 whitespace-nowrap ${
                  activeCategory === cat._id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-base-content/60 hover:text-base-content'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= COLLECTIONS GRID ================= */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {list.map(col => (
            <div
              key={col._id}
              onClick={() => navigate(`/collections/${col._id}`)}
              className="
                cursor-pointer
                rounded-2xl
                bg-base-200/60
                hover:bg-base-200
                transition
                overflow-hidden
              "
            >
              {/* Image */}
              <div className="h-44 bg-base-300 relative">
                {col.image ? (
                  <img
                    src={col.image}
                    alt={col.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-4xl opacity-30">
                    📚
                  </div>
                )}

                {col.featured && (
                  <span className="absolute top-3 left-3 bg-primary text-primary-content text-xs px-3 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-2">
                <h3 className="font-serif text-lg line-clamp-1">
                  {col.name}
                </h3>

                <p className="text-sm text-base-content/60 line-clamp-2">
                  {col.description}
                </p>

                <div className="flex justify-between text-xs text-base-content/50 pt-3">
                  <span>{col.category?.name || '—'}</span>
                  <span>{col.poems?.length || 0} poems</span>
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Loader */}
        {loading && (
          <div className="text-center py-8 text-base-content/60">
            Loading collections…
          </div>
        )}

        {currentPage < totalPages && (
          <div ref={observerRef} className="h-6" />
        )}
      </div>
    </div>
  );
};

export default Collections;
