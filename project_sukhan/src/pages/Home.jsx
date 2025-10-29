import { useState, useEffect } from 'react';
import { Link } from 'react-router';

const Home = () => {
  const [featuredPoems, setFeaturedPoems] = useState([]);
  const [popularPoets, setPopularPoets] = useState([]);
  const [trendingCollections, setTrendingCollections] = useState([]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero min-h-[70vh] bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              Welcome to <span className="text-secondary">Sukhan</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-base-content/80">
              Where words dance and emotions sing. Discover the beauty of Urdu, Hindi, and English poetry.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="join w-full">
                <input 
                  type="text" 
                  placeholder="Search poems, poets, collections..." 
                  className="input input-bordered join-item flex-1 text-lg"
                />
                <button className="btn btn-primary join-item">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="stats shadow-lg bg-base-100/80 backdrop-blur-sm">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <div className="stat-title">Poems</div>
                <div className="stat-value text-primary">10K+</div>
                <div className="stat-desc">Beautiful verses</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div className="stat-title">Poets</div>
                <div className="stat-value text-secondary">500+</div>
                <div className="stat-desc">Talented artists</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-accent">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
                  </svg>
                </div>
                <div className="stat-title">Collections</div>
                <div className="stat-value text-accent">200+</div>
                <div className="stat-desc">Curated themes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Poems Section */}
      <section className="py-16 bg-base-200/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">Featured Poems</h2>
            <p className="text-xl text-base-content/70">Discover beautiful verses that touch the soul</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPoems.map((poem) => (
              <div key={poem.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="card-body">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="card-title text-2xl">{poem.title}</h3>
                    <span className="badge badge-outline badge-primary">{poem.language}</span>
                  </div>
                  <p className="text-base-content/70 italic text-lg mb-4">"{poem.excerpt}"</p>
                  <div className="card-actions justify-between items-center">
                    <span className="font-semibold text-primary">— {poem.poet}</span>
                    <button className="btn btn-ghost btn-sm">Read More →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/poems" className="btn btn-primary btn-outline">
              Explore All Poems
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Poets Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-secondary mb-4">Popular Poets</h2>
            <p className="text-xl text-base-content/70">Meet the masters of poetic expression</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularPoets.map((poet) => (
              <div key={poet.id} className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="card-body text-center">
                  <div className="text-6xl mb-4">{poet.image}</div>
                  <h3 className="card-title justify-center text-xl">{poet.name}</h3>
                  <p className="text-base-content/60">{poet.era}</p>
                  <div className="stat p-0">
                    <div className="stat-value text-lg text-primary">{poet.poemsCount}</div>
                    <div className="stat-desc">Poems</div>
                  </div>
                  <div className="card-actions justify-center">
                    <button className="btn btn-secondary btn-sm">View Profile</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/poets" className="btn btn-secondary btn-outline">
              Discover All Poets
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Collections Section */}
      <section className="py-16 bg-gradient-to-br from-accent/10 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-accent mb-4">Trending Collections</h2>
            <p className="text-xl text-base-content/70">Curated themes and poetic journeys</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingCollections.map((collection) => (
              <div key={collection.id} className="card bg-base-100 shadow-xl image-full before:opacity-90 hover:scale-105 transition-transform duration-300">
                <figure>
                  <div className="w-full h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-6xl text-base-100">{collection.image}</span>
                  </div>
                </figure>
                <div className="card-body justify-end z-10">
                  <h3 className="card-title text-base-100 text-2xl">{collection.title}</h3>
                  <p className="text-base-100/80">{collection.description}</p>
                  <div className="card-actions justify-between items-center">
                    <span className="text-base-100 font-semibold">{collection.poemsCount} poems</span>
                    <button className="btn btn-accent btn-sm">Explore</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/collections" className="btn btn-accent btn-outline">
              Browse All Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Your Poetic Journey</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of poetry lovers in exploring the rich heritage of Urdu, Hindi, and English literature.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn btn-secondary btn-lg">
              Create Account
            </Link>
            <Link to="/explore" className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">
              Explore Without Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;