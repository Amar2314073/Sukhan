import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi'
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

  const [activeCategory, setActiveCategory] = useState(null);
  const categoryCounts = useMemo(() => {
    const counts = {};

    poetPoems.forEach(poem => {
      const cat = poem.category?.name;
      if (!cat) return;

      counts[cat] = (counts[cat] || 0) + 1;
    });

    return counts;
  }, [poetPoems]);


  useEffect(() => {
    dispatch(getPoetById(id));
    dispatch(getPoemsByPoet(id));
    return () => dispatch(clearCurrentPoet());
  }, [id, dispatch]);

  /* ================= CATEGORIES ================= */
  const categories = useMemo(() => {
    return [
      ...new Set(
        poetPoems
          .map(p => p.category?.name)
          .filter(Boolean)
      )
    ];
  }, [poetPoems]);

  useEffect(() => {
    if (!currentPoet || !poetPoems.length) return;

    const categories = poetPoems
      .map(p => p.category?.name)
      .filter(Boolean);

    const hasKavita = categories.includes('Kavita');
    const hasNonKavita = categories.some(cat => cat !== 'Kavita');

    let languageLabel = 'Poet';

    if (hasKavita && hasNonKavita) {
      languageLabel = 'Hindi & Urdu Poet';
    } else if (hasKavita) {
      languageLabel = 'Hindi Poet';
    } else {
      languageLabel = 'Urdu Poet';
    }

    // TITLE
    document.title = `${currentPoet.name} – ${languageLabel} | Sukhan`;

    // META DESCRIPTION
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        `Read ${languageLabel.toLowerCase()} by ${currentPoet.name}. Explore poems, ghazals and literary works on Sukhan.`
      );
    }
  }, [currentPoet, poetPoems]);



  useEffect(() => {
    if (categories.length && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const filteredPoems = poetPoems.filter(
    p => p.category?.name === activeCategory
  );

  if (error) return <p className="p-6 text-error">{error}</p>;
  if (!currentPoet) return null;

  return (
    <div className="bg-base-100 text-base-content">

      {/* ================= HERO BANNER ================= */}
      <div
        className="relative h-[260px] sm:h-[300px] md:h-[340px] bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://rekhta.pc.cdn.bitgravity.com/Images/poet-profile-banner.png)'
        }}
      >
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">

            <img
              src={currentPoet?.image || '/poet-placeholder.png'}
              alt={currentPoet?.name}
              className="
                w-28 h-28
                sm:w-36 sm:h-36
                md:w-40 md:h-40
                rounded-full
                object-cover
                border-4 border-white/20
                shadow-2xl
                shrink-0
              "
            />

            <div className="text-center sm:text-left max-w-[560px]">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">
                {currentPoet?.name}
              </h1>

              {(currentPoet?.birthYear || currentPoet?.country) && (
                <p className="text-sm text-white/70 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 justify-center sm:justify-start">

                  {/* Birth / Death */}
                  {currentPoet.birthYear && (
                    <span className="flex items-center gap-1">
                      <FiCalendar size={14} className="opacity-70" />
                      {currentPoet.birthYear}
                      {currentPoet.deathYear
                        ? ` – ${currentPoet.deathYear}`
                        : ' – Present'}
                    </span>
                  )}

                  {/* Separator */}
                  {currentPoet.birthYear && (
                    <span className="opacity-50">|</span>
                  )}

                  {/* Country */}
                  {currentPoet.country && (
                    <span className="flex items-center gap-1">
                      <FiMapPin size={14} className="opacity-70" />
                      {currentPoet.country}
                    </span>
                  )}

                </p>
              )}




              {currentPoet.bio && (
                <p className="
                  mt-3
                  text-sm md:text-base
                  text-white/80
                  leading-relaxed
                  line-clamp-2 md:line-clamp-3
                ">
                  {currentPoet.bio}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ================= CATEGORY TABS ================= */}
      {categories.length > 0 && (
        <div className="border-b border-base-300/40 bg-base-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex gap-6 overflow-x-auto text-sm font-medium">

              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    py-4 whitespace-nowrap border-b-2 transition
                    ${activeCategory === cat
                      ? 'border-primary text-primary'
                      : 'border-transparent text-base-content/70 hover:text-base-content'}
                  `}
                >
                  {cat}
                </button>
              ))}

            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LEFT CONTENT */}
        <div className="md:col-span-3">

          <h2 className="text-2xl font-serif mb-6">
            {activeCategory}
            <span className="text-base-content/60 text-sm ml-2">
              {filteredPoems.length}
            </span>
          </h2>

          <div className="divide-y divide-base-300/30">
            {filteredPoems.map(poem => {
              const misre = poem.content?.hindi
                ?.split('\n')
                .filter(Boolean)
                .slice(0, 2);

              return (
                <Link
                  key={poem._id}
                  to={`/poems/${poem._id}`}
                  className="
                    ghazal-card
                    relative
                    block
                    rounded-2xl
                    px-7 py-6
                    mb-7
                  "
                >
                  <div
                    className="
                      pointer-events-none
                      absolute inset-0
                      bg-gradient-to-r
                      from-transparent
                      via-white/5
                      to-transparent
                    "
                  />

                  {/* ================= POEM LINES ================= */}
                  {misre?.map((line, i) => (
                    <p
                      key={i}
                      className="
                        relative z-10
                        font-serif
                        text-lg
                        leading-relaxed
                        text-base-content
                      "
                    >
                      {line}
                    </p>
                  ))}
                </Link>


              );
            })}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden md:block">
          <div
            className="
              bg-base-200/40
              border border-base-300/40
              rounded-2xl
              p-6
              text-sm
              space-y-5
            "
          >
            {/* Heading */}
            <h3 className="font-serif text-base font-semibold text-base-content">
              प्रोफ़ाइल विवरण
            </h3>

            {/* Category-wise counts */}
            <div className="pt-2 space-y-2">
              <div className="text-xs uppercase tracking-wide text-base-content/60">
                रचनाओं का प्रकार
              </div>

              {Object.entries(categoryCounts).map(([cat, count]) => (
                <div
                  key={cat}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-base-content">
                    {cat}
                  </span>
                  <span className="
                    px-2 py-0.5
                    rounded-full
                    bg-base-300/40
                    text-xs
                    font-medium
                  ">
                    {count}
                  </span>
                </div>
              ))}
            </div>


            {/* Era */}
            <div className="flex items-center gap-3">
              <FiClock size={18} className="text-primary/80" />
              <div>
                <div className="text-xs text-base-content/60">दौर</div>
                <div className="font-medium text-base-content">
                  {currentPoet.era || '—'}
                </div>
              </div>
            </div>

            {/* Country */}
            <div className="flex items-center gap-3">
              <FiMapPin size={18} className="text-primary/80" />
              <div>
                <div className="text-xs text-base-content/60">देश</div>
                <div className="font-medium text-base-content">
                  {currentPoet.country || '—'}
                </div>
              </div>
            </div>
          </div>
        </aside>


      </div>
    </div>
  );
};

export default PoetProfile;
