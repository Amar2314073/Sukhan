import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { clearSelectedCollection, fetchCollectionById } from '../redux/slices/collectionSlice';

const CollectionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected, loading, error } = useSelector(state => state.collections);

  useEffect(() => {
    dispatch(fetchCollectionById(id));
    return () => {
      dispatch(clearSelectedCollection());
    }
  },[id, dispatch]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      Loading collection…
    </div>;
  }

  if (!selected) {
    return <div className="min-h-screen flex items-center justify-center">
      Collection not found
    </div>;
  }


  return (
    <div className="min-h-screen bg-[#0b0b0f] text-base-content">

      {/* ========== HERO ========== */}
      <div className="relative h-[320px] md:h-[380px] overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${selected.image})` }}
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-10
                     flex items-center gap-2
                     text-sm text-white/70
                     hover:text-white transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 h-full
                        flex flex-col justify-end pb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
            {selected.name}
          </h1>

          <p className="mt-3 max-w-2xl text-sm md:text-base
                        text-white/70 leading-relaxed">
            {selected.description}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mt-5 text-xs">
            {selected.category?.name && (
              <span className="px-3 py-1 rounded-full
                               bg-white/10 text-white/80">
                {selected.category.name}
              </span>
            )}

            {selected.featured && (
              <span className="px-3 py-1 rounded-full
                               bg-primary/90 text-primary-content">
                Featured
              </span>
            )}

            {selected.trending && (
              <span className="px-3 py-1 rounded-full
                               bg-pink-500/80 text-white">
                Trending
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ========== POEMS ========== */}
      <div className="max-w-5xl mx-auto px-6 py-14">

        <h2 className="text-xl font-serif text-white mb-8">
          Poems in this Collection
          <span className="ml-2 text-sm text-white/50">
            ({selected.poems.length})
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selected.poems.map((p, i) => (
            <div
              key={i}
              className="
                rounded-2xl
                p-6
                bg-base-100
                border border-base-300/10
                hover:border-primary/40
                hover:bg-base-200
                transition-all duration-300
              "
            >
              <div onClick={()=> navigate(`/poems/${p._id}`)} className="font-serif text-lg text-base-content/90 leading-relaxed cursor-pointer">
                {p.title}
              </div>

              <div onClick={()=> navigate(`/poets/${p.poet._id}`)} className="mt-3 cursor-pointer text-sm text-base-content/50">
                — {p.poet.name}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state (future safe) */}
        {selected.poems.length === 0 && (
          <p className="text-white/50 italic">
            No poems added to this collection yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;
