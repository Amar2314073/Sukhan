import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStats, fetchHomePageData } from '../redux/slices/homeSlice';

const Home = () => {
  const dispatch = useDispatch();
  const [todaysShayari, setTodaysShayari] = useState([]);
  const [literaryFacts, setLiteraryFacts] = useState([]);
  const { poemCount, poetCount, loading, error, homePageData } = useSelector((state) => state.home);
  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchHomePageData());
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setTodaysShayari([
        {
          id: 1,
          verse: "kaliyoñ ko khul ke hañsne kā andāz aa gayā",
          translation: "The flowers have learned to bloom and laugh",
          poet: "Mayal Khairabadi",
          roman: "kaliyon ko khul ke hansne ka andaz aa gaya"
        },
        {
          id: 2,
          verse: "tumhārī fā.iloñ meñ gaañv kā mausam gulābī hai",
          translation: "In your files, the village weather is rosy",
          poet: "Adam Gondvi",
          roman: "tumhaari failon mein ganv ka mausam gulabi hai"
        },
        {
          id: 3,
          verse: "chupke-chupke 'ishq karne kā koī hāsil nahīñ",
          translation: "There's no gain in loving secretly",
          poet: "Hina Rizvi",
          roman: "chupke-chupke ishq karne ka koi hasil nahin"
        }
      ]);

      setLiteraryFacts([
        {
          id: 1,
          title: "About Nastaleeq Script",
          content:
            "Nastaleeq is the beautiful script for Urdu, designed in Iran by merging Arabic Naskh and Persian Taleeq."
        },
        {
          id: 2,
          title: "First Literary Urdu",
          content:
            "The first notable literary Urdu appears in works of Amir Khusrau (1253–1325)."
        },
        {
          id: 3,
          title: "Word Origins",
          content:
            "The Urdu word 'Mallah' comes from Arabic 'Milh' (salt)."
        }
      ]);
    }, 800);
  }, []);

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
  console.log(todaysFeaturedPoetry)
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

        {/* TODAY'S SHAYARI */}
        <section className="mb-14">
          <h2 className="text-2xl font-serif font-bold border-l-4 border-primary pl-4 mb-6">
            Today’s Featured Poetry
          </h2>

          <div className="bg-base-200 rounded-2xl p-8 space-y-8">
            {todaysFeaturedPoetry.map(s => (
              <div key={s._id} className="border-b border-base-300/30 pb-6 last:border-0">
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


        {/* DID YOU KNOW */}
        <section className="mb-14">
          <h2 className="text-2xl font-serif font-bold border-l-4 border-primary pl-4 mb-6">
            Did You Know?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {literaryFacts.map(f => (
              <div
                key={f.id}
                className="bg-base-200 rounded-2xl p-6 hover:bg-base-300/20 transition"
              >
                <h3 className="font-serif text-lg font-semibold mb-3">
                  {f.title}
                </h3>
                <p className="text-base-content/70">{f.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED POEMS */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold border-l-4 border-primary pl-4 mb-6">
            Featured Poems
          </h2>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {featuredPoems.map((p) => (
              <div
                key={p._id}
                className="min-w-[320px] max-w-[320px]
                          bg-gradient-to-br from-[#121212] to-[#1b1b1b]
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
                          bg-gradient-to-br from-[#121212] to-[#1c1c1c]
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
