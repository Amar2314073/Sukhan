import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStats, setStatsFromCache } from '../redux/slices/statSlice';
import PoemCardShimmer from '../shimmer/PoemCardShimmer';
import PoetCardShimmer from '../shimmer/PoetCardShimmer';
import CollectionCardShimmer from '../shimmer/CollectionCardShimmer';
import InstallSukhanButton from '../components/InstallSukhanButton';
import axiosClient from '../utils/axiosClient';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sherRef = useRef(null);
  const freeVerseRef = useRef(null);
  const ghazalRef = useRef(null);
  const poemsRef = useRef(null);
  const collectionsRef = useRef(null);
  
  const { statsData, loading, error } = useSelector((state) => state.stats);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [homePageData, setHomePageData] = useState(null);
  const [homeLoading, setHomeLoading] = useState(true);

  const [randomSher, setRandomSher] = useState([]);
  const [randomFreeVerse, setRandomFreeVerse] = useState([]);
  const [randomGhazal, setRandomGhazal] = useState([]);
  const [sherLoading, setSherLoading] = useState(true);
  const [freeVerseLoading, setFreeVerseLoading] = useState(true);
  const [ghazalLoading, setGhazalLoading] = useState(true);

  const getCachedData = (key, ttl) => {
    const cached = JSON.parse(localStorage.getItem(key));
    if (!cached) return null;
    if (Date.now() - cached.time > ttl) return null;
    return cached.data;
  };

  const RANDOM_CONFIG = {
    sher: {
      endpoint: '/home/random/sher',
      setData: setRandomSher,
      setLoading: setSherLoading,
      storageKey: 'RANDOM_SHER',
      responseKey: 'randomSher',
    },
    freeverse: {
      endpoint: '/home/random/freeverse',
      setData: setRandomFreeVerse,
      setLoading: setFreeVerseLoading,
      storageKey: 'RANDOM_FREEVERSE',
      responseKey: 'randomFreeVerse',
    },
    ghazal: {
      endpoint: '/home/random/ghazal',
      setData: setRandomGhazal,
      setLoading: setGhazalLoading,
      storageKey: 'RANDOM_GHAZAL',
      responseKey: 'randomGhazal',
    },
  };

  const fetchRandom = async (type) => {
    const config = RANDOM_CONFIG[type];
    if (!config) return;

    const { endpoint, setData, setLoading, storageKey, responseKey } = config;

    setLoading(true);
    try {
      const res = await axiosClient.get(endpoint);
      const data = res.data[responseKey];

      setData(data);
      localStorage.setItem(
        storageKey,
        JSON.stringify({ data, time: Date.now() })
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const refreshRandomSher = () => fetchRandom('sher');
  const refreshRandomFreeVerse = () => fetchRandom('freeverse');
  const refreshRandomGhazal = () => fetchRandom('ghazal');

  const STATS_CACHE_KEY = 'SUKHAN_STATS';
  const today = new Date().toDateString();

  const getCachedStats = () => {
    try {
      const cached = localStorage.getItem(STATS_CACHE_KEY);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      if (parsed.date !== today) {
        localStorage.removeItem(STATS_CACHE_KEY);
        return null;
      }
      return parsed.data;
    } catch {
      localStorage.removeItem(STATS_CACHE_KEY);
      return null;
    }
  };


  const setCachedStats = (statsData) => {
    localStorage.setItem(
      STATS_CACHE_KEY,
      JSON.stringify({
        data: statsData,
        date: new Date().toDateString()
      })
    );
  };

  
  useEffect(() => {
    const cachedStats = getCachedStats();

    if (cachedStats) {
      dispatch(setStatsFromCache(cachedStats));
    } else {
      dispatch(fetchStats()).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setCachedStats(res.payload);
        }
      });
    }


    /* ---------------- HOME PAGE (24 HOURS) ---------------- */
    const homeCache = localStorage.getItem('Home_Page_Cache');
    if (homeCache) {
      const parsed = JSON.parse(homeCache);
      if (parsed.date === today) {
        setHomePageData(parsed.data);
        setHomeLoading(false);
      } else {
        fetchHome();
      }
    } else {
      fetchHome();
    }

    async function fetchHome() {
      try {
        setHomeLoading(true);
        const res = await axiosClient.get('/home');
        setHomePageData(res.data);
        localStorage.setItem(
          'Home_Page_Cache',
          JSON.stringify({ data: res.data, date: today })
        );
      } catch (e) {
        console.error(e);
      } finally {
        setHomeLoading(false);
      }
    }

    /* ---------------- RANDOM SECTIONS (1 HOUR) ---------------- */
   const initRandom = () => {
      const ONE_HOUR = 60 * 60 * 1000;

      const sherData = getCachedData(RANDOM_CONFIG.sher.storageKey, ONE_HOUR);
      const fvData = getCachedData(RANDOM_CONFIG.freeverse.storageKey, ONE_HOUR);
      const ghazalData = getCachedData(RANDOM_CONFIG.ghazal.storageKey, ONE_HOUR);

      if (sherData) {
        setRandomSher(sherData);
        setSherLoading(false);
      } else {
        fetchRandom('sher');
      }

      if (fvData) {
        setRandomFreeVerse(fvData);
        setFreeVerseLoading(false);
      } else {
        fetchRandom('freeverse');
      }

      if (ghazalData) {
        setRandomGhazal(ghazalData);
        setGhazalLoading(false);
      } else {
        fetchRandom('ghazal');
      }
    };

    initRandom();
  }, [dispatch]);

  const scrollNext = (ref, fallback = 320) => {
    if (!ref.current) return;
    const cardWidth = ref.current.firstChild?.offsetWidth || fallback;
    ref.current.scrollBy({
      left: cardWidth + 24,
      behavior: 'smooth'
    });
  };




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
  const trendingCollections = homePageData?.poetryCollections || [];



  return (
    <div className="min-h-screen bg-base-200 text-base-content">

      {/* HEADER */}
      <div className="border-b border-base-300/40 bg-base-200">
        <div className="max-w-6xl mx-auto px-4 py-10 text-center space-y-4">

          {/* H1 – BRAND ONLY */}
          <h1 className="text-5xl font-serif font-bold tracking-wide">
            Sukhan <span className="text-primary">سخن</span>
          </h1>

          {/* H2 – PLATFORM IDENTITY */}
          <h2 className="text-xl font-serif text-base-content/80">
            An Urdu & Hindi Poetry Platform
          </h2>

          {/* DESCRIPTION */}
          <p className="max-w-2xl mx-auto text-base-content/60 italic">
            Sukhan is a home for Urdu ghazals, nazms, shers, and soulful poetry —
            where words carry emotion, silence, and meaning.
          </p>

          {/* INTERNAL LINK (SEO GOLD) */}
          <p className="text-sm">
            Curious about the meaning of Sukhan?{" "}
            <Link to="/about" className="text-primary underline">
              Learn more
            </Link>
          </p>

          {/* CTA */}
          <div className="pt-4">
            <InstallSukhanButton />
          </div>

        </div>
      </div>


      <div className="max-w-6xl mx-auto px-4 py-10">

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
                <p className="font-serif text-md mb-2">{(s.content?.hindi)
                  ?.split('\n')
                  .filter(line => line.trim() !== '')
                  .slice(0, 1)
                  .join('\n')}
                </p>
                <p className="font-serif text-md mb-2">{(s.content?.hindi)
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

        {/* FEATURED POEMS */}
        <section className="mb-16">
          <div className='flex justify-between items-center mb-2'>
            <h2 className="text-2xl font-serif font-bold border-l-4 border-primary pl-4 mb-6">
              Featured Poems
            </h2>
            <Link to="/poems" className="text-primary hover:underline">
              All Poems
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" ref={poemsRef}>
            {homeLoading ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="min-w-[320px] max-w-[320px] snap-center">
                <PoemCardShimmer />
              </div>
            )) : featuredPoems.map((p) => (
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
                <h3 className="font-serif text-lg text-base-content mb-3 line-clamp-1">
                  {p.title}
                </h3>

                {/* Content preview */}
                <p className="text-sm text-base-content/70 italic mb-4 whitespace-pre-line">
                  {(p.content?.hindi || p.content?.english)
                    ?.split('\n')
                    .filter(line => line.trim() !== '')
                    .slice(0, 2)
                    .join('\n')}
                </p>

                {/* Poet */}
                <p className="text-sm text-base-content font-medium">
                  — {p.poet?.name}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => scrollNext(poemsRef, 320)}
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
              All Poets
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {homeLoading ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="min-w-[240px]">
                <PoetCardShimmer />
              </div>
            )) : popularPoets.map((p) => (
              <div
                key={p._id}
                onClick={()=>navigate(`/poets/${p._id}`)}
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
                <h3 className="font-serif text-lg text-base-content mb-2 line-clamp-1">
                  {p.name}
                </h3>

                {/* Era */}
                <p className="text-sm text-base-content/70 mt-1">
                  {p.era}
                </p>

                {/* Country */}
                <p className="text-xs text-base-content/60 mt-2">
                  {p.country}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* About Sukhan */}
        <section className="my-14 text-center">
          <p className="font-serif text-base-content/70 italic">
            Every word has a story —
            <Link
              to="/about"
              className="text-primary underline ml-1"
            >
              what is Sukhan?
            </Link>
          </p>
        </section>

      
        {/* ================= RANDOM PICKS ================= */}
        <section className="mb-16 space-y-16">

          {/* ===== RANDOM SHER ===== */}
          <div>
            <h2 onClick={refreshRandomSher} className="text-2xl font-serif font-bold border-l-4 border-primary pl-4 mb-6 cursor-pointer">
              Sher of the Moment
            </h2>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" ref={sherRef}>
              {sherLoading ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="min-w-[320px] max-w-[320px] snap-center">
                  <PoemCardShimmer />
                </div>
              )) : randomSher.map((s) => (
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
                  <p className="font-serif text-lg text-base-content italic mb-4 whitespace-pre-line">
                    {(s.content?.hindi || s.content?.english)
                      ?.split('\n')
                      .slice(0, 2)
                      .join('\n')}
                  </p>

                  <p className="text-sm text-base-content font-medium">
                    — {s.poet?.name}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => scrollNext(sherRef, 320)}
              className="btn btn-ghost btn-md sm:hidden mb-1 text-base-content/60"
            >
              Explore more →
            </button>

          </div>

          {/* ===== RANDOM FREE VERSE ===== */}
          <div>
            <h2 onClick={refreshRandomFreeVerse} className="text-2xl font-serif font-bold border-l-4 border-primary pl-4 mb-6 cursor-pointer">
              Verses to Wander With
            </h2>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" ref={freeVerseRef}>
              {freeVerseLoading ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="min-w-[320px] max-w-[320px] snap-center">
                  <PoemCardShimmer />
                </div>
              )) : randomFreeVerse.map((p) => (
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
                  <h3 className="font-serif text-lg text-base-content mb-3 line-clamp-1">
                    {p.title}
                  </h3>

                  <p className="text-sm text-base-content/70 italic mb-4 whitespace-pre-line">
                    {(p.content?.hindi || p.content?.roman)
                      ?.split('\n')
                      .filter(l => l.trim())
                      .slice(0, 4)
                      .join('\n')}
                  </p>

                  <p className="text-sm text-base-content font-medium">
                    — {p.poet?.name}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => scrollNext(freeVerseRef, 340)}
              className="btn btn-ghost btn-md sm:hidden mb-1 text-base-content/60"
            >
              Continue reading →
            </button>

          </div>

          {/* ===== RANDOM GHAZAL ===== */}
          <div>
            <h2 onClick={refreshRandomGhazal} className="text-2xl font-serif font-bold border-l-4 border-primary pl-4 mb-6 cursor-pointer">
              A Ghazal for the Soul
            </h2>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" ref={ghazalRef}>
              {ghazalLoading ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="min-w-[320px] max-w-[320px] snap-center">
                  <PoemCardShimmer />
                </div>
              )) : randomGhazal.map((g) => (
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
                  <h3 className="font-serif text-lg text-base-content mb-3 line-clamp-1">
                    {g.title}
                  </h3>

                  <p className="text-sm text-base-content/70 italic mb-4 whitespace-pre-line">
                    {(g.content?.hindi || g.content?.english)
                      ?.split('\n')
                      .filter(l => l.trim())
                      .slice(0, 2)
                      .join('\n')}
                  </p>

                  <p className="text-sm text-base-content font-medium">
                    — {g.poet?.name}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => scrollNext(ghazalRef, 340)}
              className="btn btn-ghost btn-md sm:hidden mb-1 text-base-content/60"
            >
              Dive deeper →
            </button>
          </div>

        </section>

        {/* COLLECTIONS */}
        <section className="mb-14">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold border-l-4 border-primary pl-4">
              Poetry Collections
            </h2>
            <Link to="/collections" className="text-primary hover:underline">
              Browse all
            </Link>
          </div>

          <div className="flex overflow-x-auto pb-4 gap-6 snap-x snap-mandatory">
            {homeLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <CollectionCardShimmer key={i} />
                ))
              : trendingCollections.map(col => (
                  <div
                    key={col._id}
                    onClick={() => navigate(`/collections/${col._id}`)}
                    className="
                      min-w-[320px] max-w-[320px]
                      cursor-pointer snap-center
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

          <button
            onClick={() => scrollNext(collectionsRef, 320)}
            className="btn btn-ghost btn-md sm:hidden mb-1 text-base-content/60"
          >
            Delve into Collections →
          </button>


        </section>

        {/* ================= STATS ================= */}
        <section className="mb-14">
          <h2 className="text-2xl font-serif font-bold border-l-4 border-primary pl-4 mb-8">
            Sukhan in Numbers
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-serif font-bold text-primary">
                {loading ? '—' : `${statsData.poems - statsData.poems % 100}+`}
              </p>
              <p className="mt-2 text-base-content/60">
                Poems
              </p>
            </div>

            <div>
              <p className="text-4xl font-serif font-bold text-primary">
                {loading ? '—' : `${statsData.poets-1}+`}
              </p>
              <p className="mt-2 text-base-content/60">
                Poets
              </p>
            </div>

            <div>
              <p className="text-4xl font-serif font-bold text-primary">
                {loading ? '—' : `${statsData.literaryEras}`}
              </p>
              <p className="mt-2 text-base-content/60">
                Literary Eras
              </p>
            </div>

            <div>
              <p className="text-4xl font-serif font-bold text-primary">
                {loading ? '—' : `${statsData.languages}`}
              </p>
              <p className="mt-2 text-base-content/60">
                Languages
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <div className="bg-base-200 border-t border-base-300/40 py-16 text-center">

        {!isAuthenticated ? (
          <>
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
          </>
        ) : (
          <>
            <h2 className="text-2xl font-serif font-semibold mb-3">
              Explore more poetry!
            </h2>
            <p className="text-base-content/60 max-w-xl mx-auto mb-8">
              Your words, your silences, your Sukhan.
            </p>

            <div className="flex justify-center gap-4 mb-6">
              <Link to="/poems" className="btn btn-primary">
                Explore Poems
              </Link>
              <Link to="/books/explore" className="btn btn-outline">
                Explore Books
              </Link>
            </div>
            <p className="text-sm text-base-content/60">
              About the name <Link to="/about" className="underline text-lg text-primary">Sukhan</Link>
            </p>
          </>
        )}
      </div>

    </div>
  );
};

export default Home;
