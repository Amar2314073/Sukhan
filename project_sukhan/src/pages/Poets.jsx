import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  fetchAllPoets,
  setCurrentPage,
  setFilters,
  clearSearchResults
} from '../redux/slices/poetSlice';

const ERAS = ['all', 'Classical', 'Modern', 'Contemporary'];

const Poets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const observerRef = useRef(null);

  const {
    poets,
    loading,
    currentPage,
    totalPages,
    filters,
    pagination
  } = useSelector(state => state.poets);

  const [activeEra, setActiveEra] = useState('all');

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    dispatch(setCurrentPage(1));
    dispatch(fetchAllPoets({
      page: 1,
      era: activeEra
    }));
  }, [dispatch, activeEra]);

  /* ================= CHANGE ERA TAB ================= */
  const changeEra = (era) => {
    setActiveEra(era);
    dispatch(clearSearchResults());
    dispatch(setFilters({ era }));
    dispatch(setCurrentPage(1));
    dispatch(fetchAllPoets({ page: 1, era }));
  };

  /* ================= INFINITE SCROLL ================= */
  useEffect(() => {
    if (loading) return;
    if (!pagination?.hasNext) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && pagination.hasNext) {
          dispatch(setCurrentPage(currentPage + 1));
          dispatch(fetchAllPoets({
            page: currentPage + 1,
            era: activeEra
          }));
        }
      },
      { rootMargin: '300px' }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loading, pagination, currentPage, activeEra, dispatch]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content">

      {/* ================= ERA TABS ================= */}
      <div className="sticky top-0 z-20 bg-base-100 border-b border-base-300/40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto text-sm font-medium">
            {ERAS.map(era => (
              <button
                key={era}
                onClick={() => changeEra(era)}
                className={`
                  py-4 whitespace-nowrap border-b-2 transition
                  ${activeEra === era
                    ? 'border-primary text-primary'
                    : 'border-transparent text-base-content/60 hover:text-base-content'}
                `}
              >
                {era === 'all' ? 'All Poets' : era}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= POETS GRID ================= */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* LOADING SHIMMER */}
        {loading && currentPage === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-2xl bg-base-200 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && poets.length === 0 && (
          <p className="text-center text-base-content/60">
            कोई शायर उपलब्ध नहीं है
          </p>
        )}

        {/* POETS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {poets.map(poet => (
            <div
              key={poet._id}
              onClick={() => navigate(`/poets/${poet._id}`)}
              className="
                cursor-pointer
                rounded-2xl
                p-6
                bg-base-200/60
                hover:bg-base-200/90
                transition
                shadow-sm
              "
            >
              <h3 className="text-xl font-serif font-semibold">
                {poet.name}
              </h3>

              <p className="text-sm text-base-content/60 mt-1">
                {poet.era} • {poet.country}
              </p>

              {poet.bio && (
                <p className="mt-3 text-sm text-base-content/70 line-clamp-3">
                  {poet.bio}
                </p>
              )}

              <div className="mt-4 flex justify-between text-sm text-base-content/60">
                <span>
                  {poet.birthYear || '—'} {poet.deathYear ? `– ${poet.deathYear}` : ''}
                </span>
                {poet.popular && (
                  <span className="text-primary font-medium">
                    Popular
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* SENTINEL */}
        {pagination?.hasNext && (
          <div ref={observerRef} className="h-6" />
        )}

        {/* BOTTOM LOADING */}
        {loading && currentPage > 1 && (
          <div className="mt-6 text-center text-base-content/60">
            Loading more poets…
          </div>
        )}

      </div>
    </div>
  );
};

export default Poets;
