import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStats } from '../redux/slices/homeSlice';

const Home = () => {
  const dispatch = useDispatch();
  const [featuredPoems, setFeaturedPoems] = useState([]);
  const [popularPoets, setPopularPoets] = useState([]);
  const [trendingCollections, setTrendingCollections] = useState([]);
  const [todaysShayari, setTodaysShayari] = useState([]);
  const [literaryFacts, setLiteraryFacts] = useState([]);
  const { poemCount, poetCount, loading, error } = useSelector((state) => state.home);

  useEffect(() => {
    dispatch(fetchStats());
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

      setFeaturedPoems([
        {
          id: 1,
          title: "The Essence of Love",
          poet: "Mirza Ghalib",
          excerpt: "Hazaaron khwahishen aisi ke har khwahish pe dam nikle...",
          language: "Urdu"
        },
        {
          id: 2,
          title: "Madhushala",
          poet: "Harivansh Rai Bachchan",
          excerpt: "Madira pilaye jaa, madhushala mein aaye...",
          language: "Hindi"
        },
        {
          id: 3,
          title: "Where the Mind is Without Fear",
          poet: "Rabindranath Tagore",
          excerpt: "Where the mind is without fear and the head is held high...",
          language: "English"
        }
      ]);

      setPopularPoets([
        { id: 1, name: "Mirza Ghalib", era: "1797–1869", poemsCount: 234 },
        { id: 2, name: "Faiz Ahmed Faiz", era: "1911–1984", poemsCount: 189 },
        { id: 3, name: "Amrita Pritam", era: "1919–2005", poemsCount: 156 },
        { id: 4, name: "Gulzar", era: "1934–Present", poemsCount: 278 }
      ]);

      setTrendingCollections([
        {
          id: 1,
          title: "Romantic Ghazals",
          description: "Timeless romantic poetry",
          poemsCount: 45
        },
        {
          id: 2,
          title: "Freedom Verses",
          description: "Poems of resistance & revolution",
          poemsCount: 32
        },
        {
          id: 3,
          title: "Nature's Melody",
          description: "Poetry inspired by nature",
          poemsCount: 28
        }
      ]);
    }, 800);
  }, []);

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
            {todaysShayari.map(s => (
              <div key={s.id} className="border-b border-base-300/30 pb-6 last:border-0">
                <p className="font-serif text-2xl mb-2">{s.verse}</p>
                <p className="text-base-content/60 italic">"{s.translation}"</p>
                <p className="text-sm text-primary mt-2">
                  {s.poet} · <span className="text-base-content/50">{s.roman}</span>
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
        <section className="mb-14">
          <h2 className="text-2xl font-serif font-bold border-l-4 border-primary pl-4 mb-6">
            Featured Poems
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredPoems.map(p => (
              <div
                key={p.id}
                className="bg-base-200 rounded-2xl p-6 hover:bg-base-300/20 transition"
              >
                <div className="flex justify-between mb-3">
                  <h3 className="font-serif text-lg">{p.title}</h3>
                  <span className="text-xs text-primary">{p.language}</span>
                </div>
                <p className="italic text-base-content/70 mb-4">
                  "{p.excerpt}"
                </p>
                <p className="text-sm text-primary">— {p.poet}</p>
              </div>
            ))}
          </div>
        </section>

        {/* POETS */}
        <section className="mb-14">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold border-l-4 border-primary pl-4">
              Master Poets
            </h2>
            <Link to="/poets" className="text-primary hover:underline">
              View all
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {popularPoets.map(p => (
              <div
                key={p.id}
                className="bg-base-200 rounded-2xl p-6 text-center hover:bg-base-300/20 transition"
              >
                <h3 className="font-serif text-lg mb-1">{p.name}</h3>
                <p className="text-sm text-base-content/60">{p.era}</p>
                <p className="mt-3 text-primary">{p.poemsCount} poems</p>
              </div>
            ))}
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
        </section>

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
