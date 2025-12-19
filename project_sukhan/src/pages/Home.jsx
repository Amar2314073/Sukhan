import { useState, useEffect } from 'react';
import { Link } from 'react-router';

const Home = () => {
  const [featuredPoems, setFeaturedPoems] = useState([]);
  const [popularPoets, setPopularPoets] = useState([]);
  const [trendingCollections, setTrendingCollections] = useState([]);
  const [todaysShayari, setTodaysShayari] = useState([]);
  const [literaryFacts, setLiteraryFacts] = useState([]);

  // Mock data for all sections
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      // Today's Top Shayari (like Rekhta's top section)
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
          roman: "chupke-chupke 'ishq karne ka koi hasil nahin"
        }
      ]);

      // Literary Facts (Did You Know section)
      setLiteraryFacts([
        {
          id: 1,
          title: "About Nastaleeq Script",
          content: "Nastaleeq is the beautiful script for Urdu, designed in 14th-15th century Iran by merging the Arabic 'Naskh' and Persian 'Taleeq' scripts."
        },
        {
          id: 2,
          title: "First Literary Urdu",
          content: "The first notable example of literary Urdu can be found in the works of Amir Khusrau (1253-1325), who pioneered the language's literary use."
        },
        {
           id: 3,
          title: "Word Origins",
          content: "The Urdu word 'Mallah' (sailor) comes from Arabic 'Milh' (salt), as those who made salt from the sea were originally called Mallah."
        }
      ]);

      // Existing data (keep but will style differently)
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
        {
          id: 1,
          name: "Mirza Ghalib",
          era: "1797-1869",
          poemsCount: 234,
          image: "📜"
        },
        {
          id: 2,
          name: "Faiz Ahmed Faiz",
          era: "1911-1984",
          poemsCount: 189,
          image: "✍️"
        },
        {
          id: 3,
          name: "Amrita Pritam",
          era: "1919-2005",
          poemsCount: 156,
          image: "🌸"
        },
        {
          id: 4,
          name: "Gulzar",
          era: "1934-Present",
          poemsCount: 278,
          image: "🌹"
        }
      ]);

      setTrendingCollections([
        {
          id: 1,
          title: "Romantic Ghazals",
          description: "Collection of timeless romantic poetry",
          poemsCount: 45,
          image: "💖"
        },
        {
          id: 2,
          title: "Freedom Verses",
          description: "Poems of independence and revolution",
          poemsCount: 32,
          image: "🕊️"
        },
        {
          id: 3,
          title: "Nature's Melody",
          description: "Celebrating the beauty of nature",
          poemsCount: 28,
          image: "🌿"
        }
      ]);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800">
      {/* Top Banner - Like Rekhta's header section */}
      <div className="bg-gradient-to-r from-amber-100 to-amber-50 border-b border-amber-200 py-4">
        <div className="container mx-auto px-4">
          <div className="text-center mb-2">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-900">
              <span className="border-b-2 border-amber-600 pb-1">Sukhan</span>
              <span className="text-amber-700 text-2xl ml-2">سخن</span>
            </h1>
            <p className="text-amber-800 mt-2 italic">Where words find their meaning</p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:w-2/3">
            
            {/* Today's Featured Poetry Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold text-amber-900 border-l-4 border-amber-600 pl-3">
                  Today's Featured Poetry
                </h2>
                <span className="text-sm text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  Updated Daily
                </span>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-amber-100 p-6">
                {todaysShayari.map((shayari) => (
                  <div key={shayari.id} className="mb-8 pb-8 border-b border-amber-50 last:border-0 last:mb-0 last:pb-0">
                    <div className="text-2xl font-serif text-amber-900 leading-relaxed mb-3">
                      {shayari.verse}
                    </div>
                    <div className="text-gray-600 mb-2 italic">
                      "{shayari.translation}"
                    </div>
                    <div className="text-sm text-amber-700">
                      <span className="font-semibold">{shayari.poet}</span>
                      <span className="mx-2">•</span>
                      <span className="text-gray-500">{shayari.roman}</span>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 pt-6 border-t border-amber-100">
                  <Link to="/explore" className="inline-flex items-center text-amber-700 hover:text-amber-900 font-medium">
                    Explore more poetry
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </section>

            {/* Did You Know Section - Educational Facts */}
            <section className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-amber-900 border-l-4 border-amber-600 pl-3 mb-6">
                Did You Know?[citation:3]
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {literaryFacts.map((fact) => (
                  <div key={fact.id} className="bg-white rounded-lg shadow-sm border border-amber-100 p-6 hover:shadow-md transition-shadow">
                    <h3 className="font-serif text-lg font-semibold text-amber-800 mb-3">
                      {fact.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {fact.content}
                    </p>
                    <div className="mt-4 pt-4 border-t border-amber-50">
                      <button className="text-sm text-amber-700 hover:text-amber-900">
                        Read more
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Poems (Revised Styling) */}
            <section className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-amber-900 border-l-4 border-amber-600 pl-3 mb-6">
                Featured Poems
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPoems.map((poem) => (
                  <div key={poem.id} className="bg-white rounded-lg shadow-sm border border-amber-100 overflow-hidden hover:shadow-md transition-all duration-300">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-serif text-xl font-semibold text-amber-900">{poem.title}</h3>
                        <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded">
                          {poem.language}
                        </span>
                      </div>
                      <p className="text-gray-600 italic mb-5 leading-relaxed border-l-2 border-amber-200 pl-4">
                        "{poem.excerpt}"
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-amber-800">— {poem.poet}</span>
                        <button className="text-amber-700 hover:text-amber-900 text-sm font-medium">
                          Read →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column - Sidebar Features */}
          <div className="lg:w-1/3">
            
            {/* Word of the Day */}
            <div className="bg-gradient-to-br from-amber-900 to-amber-800 rounded-lg shadow-lg p-6 mb-8 text-white">
              <h3 className="font-serif text-xl font-bold mb-4 text-amber-100">Word of the Day</h3>
              <div className="mb-4">
                <div className="text-3xl font-serif mb-2 text-center">نَدیم</div>
                <div className="text-center text-amber-200 mb-1">nadiim</div>
                <div className="text-center text-lg font-medium">नदीम</div>
              </div>
              <div className="text-amber-100 mb-5">
                <p className="font-semibold mb-2">Meaning:</p>
                <p className="text-amber-50">Intimate friend, confidant, close companion</p>
              </div>
              <div className="pt-5 border-t border-amber-700">
                <button className="w-full bg-amber-700 hover:bg-amber-600 text-white py-2 rounded-lg transition-colors">
                  Explore Dictionary
                </button>
              </div>
            </div>

            {/* Urdu Crossword */}
            <div className="bg-white rounded-lg shadow-sm border border-amber-100 p-6 mb-8">
              <h3 className="font-serif text-xl font-bold text-amber-900 mb-4">Urdu Crossword[citation:3]</h3>
              <p className="text-gray-700 mb-5">
                Challenge yourself with the world's first Urdu online crossword. Improve your knowledge of Urdu language and literature.
              </p>
              <button className="w-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium py-3 rounded-lg transition-colors">
                Start Playing Puzzle
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-amber-100 p-6">
              <h3 className="font-serif text-xl font-bold text-amber-900 mb-6">Sukhan at a Glance</h3>
              <div className="space-y-5">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-amber-700">📖</span>
                  </div>
                  <div>
                    <div className="font-semibold text-amber-900">10,000+ Poems</div>
                    <div className="text-sm text-gray-600">Beautiful verses in multiple languages</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-amber-700">✍️</span>
                  </div>
                  <div>
                    <div className="font-semibold text-amber-900">500+ Poets</div>
                    <div className="text-sm text-gray-600">From classical to contemporary</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-amber-700">📚</span>
                  </div>
                  <div>
                    <div className="font-semibold text-amber-900">200+ Collections</div>
                    <div className="text-sm text-gray-600">Thematically curated poetry</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Sections - Poets & Collections */}
        <div className="mt-12">
          
          {/* Popular Poets */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif font-bold text-amber-900 border-l-4 border-amber-600 pl-3">
                Master Poets
              </h2>
              <Link to="/poets" className="text-amber-700 hover:text-amber-900 font-medium">
                View all poets →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularPoets.map((poet) => (
                <div key={poet.id} className="bg-white rounded-lg shadow-sm border border-amber-100 p-6 text-center hover:shadow-md transition-shadow">
                  <div className="text-5xl mb-4">{poet.image}</div>
                  <h3 className="font-serif text-xl font-semibold text-amber-900 mb-1">{poet.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{poet.era}</p>
                  <div className="text-amber-700 font-medium mb-4">
                    {poet.poemsCount} poems
                  </div>
                  <button className="text-amber-700 hover:text-amber-900 text-sm font-medium">
                    Explore works
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Trending Collections */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif font-bold text-amber-900 border-l-4 border-amber-600 pl-3">
                Poetry Collections
              </h2>
              <Link to="/collections" className="text-amber-700 hover:text-amber-900 font-medium">
                Browse all collections →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingCollections.map((collection) => (
                <div key={collection.id} className="relative rounded-lg overflow-hidden shadow-lg group">
                  <div className="h-48 bg-gradient-to-r from-amber-800 to-amber-700 flex items-center justify-center">
                    <span className="text-6xl text-white opacity-90">{collection.image}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-serif text-xl font-bold mb-2">{collection.title}</h3>
                    <p className="text-amber-100 mb-3">{collection.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-200">{collection.poemsCount} poems</span>
                      <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
                        Explore
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Begin Your Journey with Words
          </h2>
          <p className="text-xl text-amber-100 mb-10 max-w-2xl mx-auto">
            Join a community passionate about Urdu, Hindi, and English poetry. Discover, share, and celebrate literary beauty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-amber-900 hover:bg-amber-100 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Create Free Account
            </Link>
            <Link 
              to="/explore" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Explore as Guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;