import { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPoetById,
  getPoemsByPoet,
  clearCurrentPoet
} from '../redux/slices/poetSlice';

const PoetProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentPoet, poetPoems, loading, error } = useSelector(
    state => state.poets
  );

  useEffect(() => {
    dispatch(getPoetById(id));
    dispatch(getPoemsByPoet(id));
    return () => dispatch(clearCurrentPoet());
  }, [id, dispatch]);

  if (error) return <p className="p-6 text-error">{error}</p>;
  if (!currentPoet) return null;

  return (
    <div className="bg-base-100 text-base-content">

      {/* ================= HERO BANNER ================= */}
      <div
        className="relative h-[280px] md:h-[340px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://rekhta.pc.cdn.bitgravity.com/Images/poet-profile-banner.png)"
        }}
      >
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/65" />

        {/* poet info */}
        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center align-middle">
          <div className="flex items-center align-middle gap-6">

            <img
              src={currentPoet.image || '/poet-placeholder.png'}
              alt={currentPoet.name}
              className="
                w-36 h-36 md:w-40 md:h-40
                rounded-full
                object-cover
                border-4 border-white/20
                shadow-2xl
                shrink-0
              "
            />

            <div className='flex flex-col justify-center max-w-[520px]'>
              <h1 className="text-2xl md:text-3xl font-serif font-bold leading-tight text-white">
                {currentPoet.name}
              </h1>
              <div className='flex items-center gap-3'>
                <p className="text-sm text-white/75 mt-1">
                {currentPoet.deathYear && currentPoet.birthYear
                  ? `${currentPoet.birthYear || '—'} – ${currentPoet.deathYear || '—'}`
                  : (currentPoet.birthYear && !currentPoet.deathYear ? currentPoet.birthYear : '' )}
                </p>
                <span> | </span>
                <p className="text-white/80 mt-1">
                  {currentPoet.country}
                </p>
              </div>

              {/* BIO */}
              {currentPoet.bio && (
                <p className="mt-3 text-sm md:text-base text-white/80 leading-relaxed max-w-full md:max-w-[520px] lg:max-w-[560px] line-clamp-2 md:line-clamp-3">
                  {currentPoet.bio}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ================= TABS BAR ================= */}
      <div className="border-b border-base-300/40 bg-base-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-8 text-sm font-medium">

            <button className="py-4 border-b-2 border-primary text-primary">
              संपूर्ण
            </button>
            <button className="py-4 text-base-content/70 hover:text-base-content">
              परिचय
            </button>
            <button className="py-4 text-base-content/70 hover:text-base-content">
              ग़ज़ल {poetPoems.length}
            </button>
            <button className="py-4 text-base-content/70 hover:text-base-content">
              नज़्म
            </button>
            <button className="py-4 text-base-content/70 hover:text-base-content">
              शेर
            </button>

          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LEFT CONTENT */}
        <div className="md:col-span-3">

          
          {/* GHAZALS */}
          <h2 className="text-2xl font-serif mb-6">
            ग़ज़ल
            <span className="text-base-content/60 text-sm ml-2">
              {poetPoems.length}
            </span>
          </h2>

          <div className="divide-y divide-base-300/30">
            {poetPoems.map(poem => (
              <Link
                key={poem._id}
                to={`/poems/${poem._id}`}
                className="
                  block py-5
                  transition
                  hover:bg-base-200/40
                  px-2 -mx-2
                "
              >
                <p className="font-serif italic text-lg line-clamp-2">
                  {poem.content?.hindi || poem.content?.roman}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR (future use like Rekhta) */}
        <aside className="hidden md:block">
          <div className="
            bg-base-200/40
            border border-base-300/40
            rounded-xl
            p-4
            text-sm
            text-base-content/70
          ">
            शायरों की सूची  
            <div className="mt-3 space-y-2 text-base-content/60">
              <div>• लोकप्रिय शायर</div>
              <div>• क्लासिकी शायर</div>
              <div>• आधुनिक शायर</div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default PoetProfile;
