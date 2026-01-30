import { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStats, fetchHomePageData } from '../redux/slices/homeSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sherRef = useRef(null);
  const freeVerseRef = useRef(null);
  const ghazalRef = useRef(null);
  const poemsRef = useRef(null);
  
  const { poemCount, poetCount, loading, error, homePageData } = useSelector((state) => state.home);
  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchHomePageData());
  }, [dispatch]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading data: {error}</p>
      </div>
    );
  }

  const featuredPoems = homePageData?.featuredPoems || [];
  const popularPoets = homePageData?.popularPoets || [];
  const todaysFeaturedPoetry = homePageData?.todaysPoetry || [];
  const randomSher = homePageData?.randomSher || [];
  const randomFreeVerse = homePageData?.randomFreeVerse || [];
  const randomGhazal = homePageData?.randomGhazal || [];
  // const trendingCollections = homePageData?.poetryCollections.map((title, index) => ({
  //   id: index + 1,
  //   title
  // })) || [];

  // console.log(featuredPoems, popularPoets);



  return (
    <div className="min-h-screen bg-base-100 text-base-content">

      {/* HEADER */}
      <div className="border-b border-base-300/40 bg-base-100">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <h1 className="text-4xl font-serif font-bold">
            Sukhan <span className="text-primary">سخن</span>
          </h1>
          <p className="text-base-content/60 italic mt-2">
            Where words find their meaning
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">


        {/* ================= RANDOM PICKS ================= */}
        <section className="mb-16 space-y-16">

          {/* ===== RANDOM SHER ===== */}
          <div>
            <h2 className="text-2xl font-serif font-bold border-l-4 border-primary pl-4 mb-6">
              Sher of the Moment
            </h2>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" ref={sherRef}>
              {randomSher.map((s) => (
                <div
                  key={s._id}
                  onClick={()=>navigate(`/poems/${s._id}`)}
                  className="min-w-[320px] max-w-[320px]
                            snap-center
                            bg-gradient-to-br from-base-300/80 to-base-100
                            border border-white/10
                            rounded-2xl p-6
                            hover:scale-[1.03] hover:border-primary/40
                            transition-all duration-300"
                >
                  <p className="font-serif text-lg text-[#f5f3ef] italic mb-4 whitespace-pre-line">
                    {(s.content?.hindi || s.content?.urdu)
                      ?.split('\n')
                      .slice(0, 2)
                      .join('\n')}
                  </p>

                  <p className="text-sm text-[#d4af37] font-medium">
                    — {s.poet?.name}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                if (!sherRef.current) return;

                const cardWidth = sherRef.current.firstChild?.offsetWidth || 320;
                const gap = 24;

                sherRef.current.scrollBy({
                  left: cardWidth + gap,
                  behavior: 'smooth'
                });
              }}
              className="btn btn-ghost btn-md sm:hidden mb-1 text-base-content/60"
            >
              Explore more →
            </button>

          </div>

          {/* ===== RANDOM FREE VERSE ===== */}
          <div>
            <h2 className="text-2xl font-serif font-bold border-l-4 border-primary pl-4 mb-6">
              Verses to Wander With
            </h2>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" ref={freeVerseRef}>
              {randomFreeVerse.map((p) => (
                <div
                  key={p._id}
                  onClick={()=>navigate(`/poems/${p._id}`)}
                  className="min-w-[340px] max-w-[340px]
                            snap-center
                            bg-gradient-to-br from-base-300/80 to-base-100
                            border border-white/10
                            rounded-2xl p-6
                            hover:scale-[1.03] hover:border-primary/40
                            transition-all duration-300"
                >
                  <h3 className="font-serif text-lg text-[#f5f3ef] mb-3 line-clamp-1">
                    {p.title}
                  </h3>

                  <p className="text-sm text-[#bdb7aa] italic mb-4 whitespace-pre-line">
                    {(p.content?.hindi || p.content?.roman)
                      ?.split('\n')
                      .filter(l => l.trim())
                      .slice(0, 4)
                      .join('\n')}
                  </p>

                  <p className="text-sm text-[#d4af37] font-medium">
                    — {p.poet?.name}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                if (!freeVerseRef.current) return;

                const cardWidth = freeVerseRef.current.firstChild?.offsetWidth || 340;
                const gap = 24;

                freeVerseRef.current.scrollBy({
                  left: cardWidth + gap,
                  behavior: 'smooth'
                });
              }}
              className="btn btn-ghost btn-md sm:hidden mb-1 text-base-content/60"
            >
              Continue reading →
            </button>

          </div>

          {/* ===== RANDOM GHAZAL ===== */}
          <div>
            <h2 className="text-2xl font-serif font-bold border-l-4 border-primary pl-4 mb-6">
              A Ghazal for the Soul
            </h2>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" ref={ghazalRef}>
              {randomGhazal.map((g) => (
                <div
                  key={g._id}
                  onClick={()=>navigate(`/poems/${g._id}`)}
                  className="min-w-[340px] max-w-[340px] snap-center
                            bg-gradient-to-br from-base-300/80 to-base-100
                            border border-white/10
                            rounded-2xl p-6
                            hover:scale-[1.03] hover:border-primary/40
                            transition-all duration-300"
                >
                  <h3 className="font-serif text-lg text-[#f5f3ef] mb-3 line-clamp-1">
                    {g.title}
                  </h3>

                  <p className="text-sm text-[#bdb7aa] italic mb-4 whitespace-pre-line">
                    {(g.content?.hindi || g.content?.urdu)
                      ?.split('\n')
                      .filter(l => l.trim())
                      .slice(0, 2)
                      .join('\n')}
                  </p>

                  <p className="text-sm text-[#d4af37] font-medium">
                    — {g.poet?.name}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                if (!ghazalRef.current) return;
                const cardWidth = ghazalRef.current.firstChild?.offsetWidth || 340;
                const gap = 24;
                ghazalRef.current.scrollBy({
                  left: cardWidth + gap,
                  behavior: 'smooth'
                });
              }}
              className="btn btn-ghost btn-md sm:hidden mb-1 text-base-content/60"
            >
              Dive deeper →
            </button>
          </div>

        </section>


        {/* TODAY'S SHAYARI */}
        <section className="mb-14">
          <h2 className="text-2xl font-serif font-bold border-l-4 border-primary pl-4 mb-6">
            Today’s Featured Poetry
          </h2>

          <div className="bg-base-200 rounded-2xl p-8 space-y-8">
            {todaysFeaturedPoetry.map(s => (
              <div
                key={s._id}
                onClick={()=>navigate(`/poems/${s._id}`)}
                className="border-b border-base-300/30 pb-6 last:border-0">
                <p className="font-serif text-lg mb-2">{(s.content?.hindi)
                  ?.split('\n')
                  .filter(line => line.trim() !== '')
                  .slice(0, 1)
                  .join('\n')}
                </p>
                <p className="font-serif text-lg mb-2">{(s.content?.hindi)
                  ?.split('\n')
                  .filter(line => line.trim() !== '')
                  .slice(1, 2)
                  .join('\n')}
                </p>
                <p className="text-sm text-primary mt-2">
                  {s.poet.name} · <span className="text-base-content/50">{s.content.roman}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="mb-14">
          <h2 className="text-2xl font-serif font-bold border-l-4 border-primary pl-4 mb-8">
            Sukhan in Numbers
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-serif font-bold text-primary">
                {loading ? '—' : `${poemCount-1}+`}
              </p>
              <p className="mt-2 text-base-content/60">
                Poems
              </p>
            </div>

            <div>
              <p className="text-4xl font-serif font-bold text-primary">
                {loading ? '—' : `${poetCount-1}+`}
              </p>
              <p className="mt-2 text-base-content/60">
                Poets
              </p>
            </div>

            <div>
              <p className="text-4xl font-serif font-bold text-primary">
                3
              </p>
              <p className="mt-2 text-base-content/60">
                Literary Eras
              </p>
            </div>

            <div>
              <p className="text-4xl font-serif font-bold text-primary">
                3
              </p>
              <p className="mt-2 text-base-content/60">
                Languages
              </p>
            </div>
          </div>
        </section>

        {/* FEATURED POEMS */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold border-l-4 border-primary pl-4 mb-6">
            Featured Poems
          </h2>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" ref={poemsRef}>
            {featuredPoems.map((p) => (
              <div
                key={p._id}
                onClick={()=>navigate(`/poems/${p._id}`)}
                className="min-w-[320px] max-w-[320px] snap-center
                          bg-gradient-to-br from-base-300/80 to-base-100
                          border border-white/10
                          rounded-2xl p-6
                          hover:scale-[1.03] hover:border-primary/40
                          transition-all duration-300"
              >
                {/* Title */}
                <h3 className="font-serif text-lg text-[#f5f3ef] mb-3 line-clamp-1">
                  {p.title}
                </h3>

                {/* Content preview */}
                <p className="text-sm text-[#bdb7aa] italic mb-4 whitespace-pre-line">
                  {(p.content?.hindi || p.content?.english)
                    ?.split('\n')
                    .filter(line => line.trim() !== '')
                    .slice(0, 2)
                    .join('\n')}
                </p>

                {/* Poet */}
                <p className="text-sm text-[#d4af37] font-medium">
                  — {p.poet?.name}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              if (!poemsRef.current) return;
              const cardWidth = poemsRef.current.firstChild?.offsetWidth || 320;
              const gap = 24;
              poemsRef.current.scrollBy({
                left: cardWidth + gap,
                behavior: 'smooth'
              });
            }}
            className="btn btn-ghost btn-md sm:hidden mb-1 text-base-content/60"
          >
            Drift further →
          </button>
        </section>


       {/* POPULAR POETS */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold border-l-4 border-primary pl-4">
              Popular Poets
            </h2>
            <Link to="/poets" className="text-primary hover:underline">
              View all
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {popularPoets.map((p) => (
              <div
                key={p._id}
                className="min-w-[240px]
                          bg-gradient-to-br from-base-300/80 to-base-100
                          border border-white/10
                          rounded-2xl p-6 text-center
                          hover:scale-[1.04] hover:border-primary/40
                          transition-all duration-300"
              >
                {/* Poet Image */}
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-20 h-20 mx-auto rounded-full object-cover mb-4
                              border border-white/20"
                  />
                )}

                {/* Name */}
                <h3 className="font-serif text-lg text-[#f5f3ef]">
                  {p.name}
                </h3>

                {/* Era */}
                <p className="text-sm text-[#a8a29e] mt-1">
                  {p.era}
                </p>

                {/* Country */}
                <p className="text-xs text-[#7c766a] mt-2">
                  {p.country}
                </p>
              </div>
            ))}
          </div>
        </section>


        {/* COLLECTIONS */}
        {/* <section className="mb-14">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold border-l-4 border-primary pl-4">
              Poetry Collections
            </h2>
            <Link to="/collections" className="text-primary hover:underline">
              Browse all
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {trendingCollections.map(c => (
              <div
                key={c.id}
                className="bg-base-200 rounded-2xl p-6 hover:bg-base-300/20 transition"
              >
                <h3 className="font-serif text-xl mb-2">{c.title}</h3>
                <p className="text-base-content/70 mb-4">{c.description}</p>
                <p className="text-sm text-primary">{c.poemsCount} poems</p>
              </div>
            ))}
          </div>
        </section> */}

      </div>

      {/* FOOTER CTA */}
      <div className="bg-base-200 border-t border-base-300/40 py-16 text-center">
        <h2 className="text-3xl font-serif font-bold mb-4">
          Begin Your Journey with Words
        </h2>
        <p className="text-base-content/60 max-w-xl mx-auto mb-8">
          Discover, read, and feel poetry across languages and eras.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="btn btn-primary">
            Create Account
          </Link>
          <Link to="/explore" className="btn btn-outline">
            Explore as Guest
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
