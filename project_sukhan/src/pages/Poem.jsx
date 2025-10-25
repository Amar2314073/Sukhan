import { useState, useEffect } from 'react';
import { Link } from 'react-router';

const Poems = () => {
  const [activeSection, setActiveSection] = useState('ghazal');
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API calls
  const poemSections = [
    { id: 'ghazal', name: 'Ghazal', icon: '🌙', description: 'Traditional Urdu poetry with rhyming couplets' },
    { id: 'nazm', name: 'Nazm', icon: '📜', description: 'Modern Urdu poetry with structured verses' },
    { id: 'sher', name: 'Sher', icon: '✨', description: 'Couplets from classical poetry' },
    { id: 'rubai', name: 'Rubai', icon: '🔶', description: 'Quatrains in Persian style' },
    { id: 'qita', name: 'Qita', icon: '📝', description: 'Fragments and excerpts' },
    { id: 'masnavi', name: 'Masnavi', icon: '📖', description: 'Long narrative poems' }
  ];

  // Mock data for poems - replace with actual API data
  const fetchPoems = async (section) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = {
        ghazal: [
          {
            id: 1,
            title: "Dil-e-Nadaan",
            poet: "Mirza Ghalib",
            excerpt: "Dil-e-nadaan tujhe hua kya hai...",
            content: "Dil-e-nadaan tujhe hua kya hai\nAakhir is dard ki dawa kya hai\nHum hain mushtaq aur woh bezaar\nYa ilahi yeh majra kya hai",
            language: "Urdu",
            likes: 245,
            shares: 34,
            date: "18th Century"
          },
          {
            id: 2,
            title: "Ranjish Hi Sahi",
            poet: "Faiz Ahmed Faiz",
            excerpt: "Ranjish hi sahi dil hi dukhane ke liye aa...",
            content: "Ranjish hi sahi dil hi dukhane ke liye aa\nAa phir se mujhe chhod ke jaane ke liye aa",
            language: "Urdu",
            likes: 189,
            shares: 28,
            date: "20th Century"
          },
          {
            id: 3,
            title: "Chandni Raat",
            poet: "Jaun Elia",
            excerpt: "Chandni raat mein akele...",
            content: "Chandni raat mein akele\nTum yaad aaye bahut\nTumhari yaad ne aaj\nMujhe roy diya bahut",
            language: "Urdu",
            likes: 167,
            shares: 22,
            date: "Modern"
          }
        ],
        nazm: [
          {
            id: 4,
            title: "Aaj Bazaar Mein",
            poet: "Faiz Ahmed Faiz",
            excerpt: "Aaj bazaar mein pa-ba-jaulaan chalo...",
            content: "Aaj bazaar mein pa-ba-jaulaan chalo\nDast afshaan chalo, mast-o-raqsaan chalo",
            language: "Urdu",
            likes: 278,
            shares: 45,
            date: "20th Century"
          },
          {
            id: 5,
            title: "Woh Log Bahut Khush Qismat The",
            poet: "Faiz Ahmed Faiz",
            excerpt: "Woh log bahut khush qismat the...",
            content: "Woh log bahut khush qismat the\nJo ishq ko kaam samajhte the\nYa kaam se aashiqui karte the",
            language: "Urdu",
            likes: 234,
            shares: 38,
            date: "20th Century"
          }
        ],
        sher: [
          {
            id: 6,
            title: "Ishq",
            poet: "Mirza Ghalib",
            excerpt: "Ishq par zor nahin hai ye woh aatish Ghalib...",
            content: "Ishq par zor nahin hai ye woh aatish Ghalib\nKe lagaye na lage aur bujhaye na bane",
            language: "Urdu",
            likes: 312,
            shares: 67,
            date: "18th Century"
          },
          {
            id: 7,
            title: "Mohabbat",
            poet: "Mir Taqi Mir",
            excerpt: "Dikhai diye yun ke bekhud kiya...",
            content: "Dikhai diye yun ke bekhud kiya\nHamen aap se bhi juda kar chale",
            language: "Urdu",
            likes: 198,
            shares: 31,
            date: "18th Century"
          }
        ],
        rubai: [
          {
            id: 8,
            title: "Rubai on Life",
            poet: "Allama Iqbal",
            excerpt: "Khudi ko kar buland itna...",
            content: "Khudi ko kar buland itna\nKe har taqdeer se pehle\nKhuda bande se khud pooche\nBata teri raza kya hai",
            language: "Urdu",
            likes: 289,
            shares: 52,
            date: "20th Century"
          }
        ],
        qita: [
          {
            id: 9,
            title: "Qita on Hope",
            poet: "Mirza Ghalib",
            excerpt: "Hazaaron khwahishen aisi...",
            content: "Hazaaron khwahishen aisi ke har khwahish pe dam nikle\nBahut nikle mere armaan lekin phir bhi kam nikle",
            language: "Urdu",
            likes: 345,
            shares: 78,
            date: "18th Century"
          }
        ],
        masnavi: [
          {
            id: 10,
            title: "Masnavi-e-Rumi",
            poet: "Jalaluddin Rumi",
            excerpt: "Ba maqsood-e-dil-e-man nazdik tar aay...",
            content: "Ba maqsood-e-dil-e-man nazdik tar aay\nKe har dam ze jan-e-man qurbat kunaam",
            language: "Persian",
            likes: 423,
            shares: 89,
            date: "13th Century"
          }
        ]
      };

      setPoems(mockData[section] || []);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchPoems(activeSection);
  }, [activeSection]);

  const filteredPoems = poems.filter(poem =>
    poem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poem.poet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poem.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">Poetic Collection</h1>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Explore the rich heritage of Urdu, Hindi, and Persian poetry through carefully curated collections
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="join w-full">
            <input 
              type="text" 
              placeholder="Search poems, poets, or verses..." 
              className="input input-bordered join-item flex-1 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary join-item">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>
        </div>

        {/* Poetry Type Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {poemSections.map((section) => (
              <button
                key={section.id}
                className={`btn btn-lg ${
                  activeSection === section.id 
                    ? 'btn-primary' 
                    : 'btn-outline btn-primary'
                } transition-all duration-300`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="text-2xl mr-2">{section.icon}</span>
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Section Info */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-secondary mb-4">
            {poemSections.find(s => s.id === activeSection)?.name}
          </h2>
          <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
            {poemSections.find(s => s.id === activeSection)?.description}
          </p>
        </div>

        {/* Poems Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-lg">Loading {poemSections.find(s => s.id === activeSection)?.name}...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredPoems.map((poem) => (
                <div key={poem.id} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <div className="card-body">
                    {/* Header with title and language */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="card-title text-2xl group-hover:text-primary transition-colors">
                        {poem.title}
                      </h3>
                      <span className="badge badge-primary badge-lg">{poem.language}</span>
                    </div>

                    {/* Poet and era */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-semibold text-primary text-lg">— {poem.poet}</span>
                      <span className="text-sm text-base-content/60">({poem.date})</span>
                    </div>

                    {/* Poem excerpt */}
                    <div className="mb-6">
                      <p className="text-base-content/80 italic text-lg leading-relaxed">
                        "{poem.excerpt}"
                      </p>
                    </div>

                    {/* Full content with read more */}
                    <div className="collapse collapse-arrow bg-base-100 rounded-lg mb-4">
                      <input type="checkbox" />
                      <div className="collapse-title text-lg font-medium text-primary">
                        Read Full Poem
                      </div>
                      <div className="collapse-content">
                        <p className="text-base-content/70 leading-relaxed whitespace-pre-line">
                          {poem.content}
                        </p>
                      </div>
                    </div>

                    {/* Stats and actions */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-base-300">
                      <div className="flex items-center gap-4 text-sm text-base-content/60">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                          {poem.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                          </svg>
                          {poem.shares}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                          </svg>
                        </button>
                        <button className="btn btn-primary btn-sm">Save</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No results message */}
            {filteredPoems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-base-content mb-2">No poems found</h3>
                <p className="text-base-content/60 mb-6">
                  {searchTerm ? `No results for "${searchTerm}" in ${poemSections.find(s => s.id === activeSection)?.name}` : `No ${poemSections.find(s => s.id === activeSection)?.name} available at the moment`}
                </p>
                {searchTerm && (
                  <button 
                    className="btn btn-outline btn-primary"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}

            {/* Load More Button */}
            {filteredPoems.length > 0 && (
              <div className="text-center">
                <button className="btn btn-primary btn-outline btn-lg">
                  Load More Poems
                </button>
              </div>
            )}
          </>
        )}

        {/* Quick Stats */}
        <div className="bg-base-200 rounded-2xl p-8 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="stat-figure text-primary text-4xl mb-2">📚</div>
              <div className="stat-value text-3xl text-primary">10,000+</div>
              <div className="stat-title">Poems</div>
            </div>
            <div>
              <div className="stat-figure text-secondary text-4xl mb-2">✍️</div>
              <div className="stat-value text-3xl text-secondary">500+</div>
              <div className="stat-title">Poets</div>
            </div>
            <div>
              <div className="stat-figure text-accent text-4xl mb-2">🌍</div>
              <div className="stat-value text-3xl text-accent">3</div>
              <div className="stat-title">Languages</div>
            </div>
            <div>
              <div className="stat-figure text-info text-4xl mb-2">📖</div>
              <div className="stat-value text-3xl text-info">6</div>
              <div className="stat-title">Categories</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-base-content mb-4">
            Discover More Poetic Treasures
          </h3>
          <p className="text-base-content/60 mb-6 max-w-2xl mx-auto">
            Explore our complete collection of classical and contemporary poetry from master poets across generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/poets" className="btn btn-primary btn-lg">
              Explore Poets
            </Link>
            <Link to="/collections" className="btn btn-outline btn-primary btn-lg">
              Browse Collections
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poems;