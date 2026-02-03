import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStats } from '../redux/slices/homeSlice';
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
  
  const { poemCount, poetCount, loading, error } = useSelector((state) => state.home);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [homePageData, setHomePageData] = useState(null);
  const [homeLoading, setHomeLoading] = useState(true);

  const [randomSher, setRandomSher] = useState([]);
  const [randomFreeVerse, setRandomFreeVerse] = useState([]);
  const [randomGhazal, setRandomGhazal] = useState([]);
  const [randomLoading, setRandomLoading] = useState(true);


  const refreshRandomSher = async () => {
    setRandomLoading(true);
    try {
      const res = await axiosClient.get('/home/random/sher');
      setRandomSher(res.data.randomSher);
      localStorage.setItem(
        'RANDOM_SHER',
        JSON.stringify({ data: res.data.randomSher, time: Date.now() })
      );
    } catch (e) {
      console.error(e);
    } finally {
      setRandomLoading(false);
    }
  };

  const refreshRandomFreeVerse = async () => {
    setRandomLoading(true);
    try {
      const res = await axiosClient.get('/home/random/freeverse');
      setRandomFreeVerse(res.data.randomFreeVerse);
      localStorage.setItem(
        'RANDOM_FREEVERSE',
        JSON.stringify({ data: res.data.randomFreeVerse, time: Date.now() })
      );
    } catch (e) {
      console.error(e);
    } finally {
      setRandomLoading(false);
    }
  };

  const refreshRandomGhazal = async () => {
    setRandomLoading(true);
    try {
      const res = await axiosClient.get('/home/random/ghazal');
      setRandomGhazal(res.data.randomGhazal);
      localStorage.setItem(
        'RANDOM_GHAZAL',
        JSON.stringify({ data: res.data.randomGhazal, time: Date.now() })
      );
    } catch (e) {
      console.error(e);
    } finally {
      setRandomLoading(false);
    }
  };

  
  useEffect(() => {
    dispatch(fetchStats());

    const today = new Date().toDateString();

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
    const initRandom = async () => {
      setRandomLoading(true);

      const ONE_HOUR = 60 * 60 * 1000;

      const cachedSher = JSON.parse(localStorage.getItem('RANDOM_SHER'));
      const cachedFV = JSON.parse(localStorage.getItem('RANDOM_FREEVERSE'));
      const cachedG = JSON.parse(localStorage.getItem('RANDOM_GHAZAL'));

      const isSherValid = cachedSher && Date.now() - cachedSher.time < ONE_HOUR;
      const isFVValid = cachedFV && Date.now() - cachedFV.time < ONE_HOUR;
      const isGValid = cachedG && Date.now() - cachedG.time < ONE_HOUR;

      if (isSherValid) setRandomSher(cachedSher.data);
      if (isFVValid) setRandomFreeVerse(cachedFV.data);
      if (isGValid) setRandomGhazal(cachedG.data);

      const requests = [];
      if (!isSherValid) requests.push(axiosClient.get('/home/random/sher'));
      if (!isFVValid) requests.push(axiosClient.get('/home/random/freeverse'));
      if (!isGValid) requests.push(axiosClient.get('/home/random/ghazal'));

      try {
        const responses = await Promise.all(requests);

        responses.forEach(res => {
          if (res.data.randomSher) {
            setRandomSher(res.data.randomSher);
            localStorage.setItem(
              'RANDOM_SHER',
              JSON.stringify({ data: res.data.randomSher, time: Date.now() })
            );
          }
          if (res.data.randomFreeVerse) {
            setRandomFreeVerse(res.data.randomFreeVerse);
            localStorage.setItem(
              'RANDOM_FREEVERSE',
              JSON.stringify({ data: res.data.randomFreeVerse, time: Date.now() })
            );
          }
          if (res.data.randomGhazal) {
            setRandomGhazal(res.data.randomGhazal);
            localStorage.setItem(
              'RANDOM_GHAZAL',
              JSON.stringify({ data: res.data.randomGhazal, time: Date.now() })
            );
          }
        });
      } catch (e) {
        console.error(e);
      } finally {
        setRandomLoading(false);
      }
    };

    initRandom();
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
  const trendingCollections = homePageData?.poetryCollections || [];



  return (
    <div className="min-h-screen bg-base-200 text-base-content">

      {/* HEADER */}
      <div className="border-b border-base-300/40 bg-base-200">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <h1 className="text-4xl font-serif font-bold">
            Sukhan <span className="text-primary">سخن</span>
          </h1>
          {isAuthenticated ? (
            <p className="text-md text-base-content mb-2">
              Welcome back {user.name.split(' ')[0]}! words are waiting for you.
            </p>
          ):(
            <p className="text-base-content/60 italic mt-2">
              Where words find their meaning
            </p>
          )}
          <InstallSukhanButton/>
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

        {/* ================= RANDOM PICKS ================= */}
        <section className="mb-16 space-y-16">

          {/* ===== RANDOM SHER ===== */}
          <div>
            <h2 className="text-2xl font-serif font-bold border-l-4 border-primary pl-4 mb-6">
              Sher of the Moment
            </h2>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" ref={sherRef}>
              {randomLoading ? Array.from({ length: 5 }).map((_, i) => (
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
              {randomLoading ? Array.from({ length: 5 }).map((_, i) => (
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
              {randomLoading ? Array.from({ length: 5 }).map((_, i) => (
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
            onClick={() => {
              if (!collectionsRef.current) return;

              const cardWidth =
                collectionsRef.current.firstChild?.offsetWidth || 320;
              const gap = 24;

              collectionsRef.current.scrollBy({
                left: cardWidth + gap,
                behavior: 'smooth'
              });
            }}
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

            <div className="flex justify-center gap-4">
              <Link to="/poems" className="btn btn-primary">
                Explore Poems
              </Link>
              <Link to="/profile" className="btn btn-outline">
                My Profile
              </Link>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default Home;
