import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { 
  fetchPoemsByCategory, 
  searchPoems,
  clearSearchResults,
  clearPoemsByCategory,
  setCurrentPage
} from '../redux/slices/poemSlice';
import { 
  getCategoriesByType, 
  clearCurrentCategory,
  clearError 
} from '../redux/slices/categorySlice';

const Poems = () => {
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState('ghazal');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);

  // Redux selectors
  const { 
    poemsByCategory, 
    searchResults, 
    loading, 
    searchLoading, 
    error,
    currentPage,
    totalPages 
  } = useSelector((state) => state.poems);

  const { 
    categories, 
    currentCategory,
    loading: categoriesLoading 
  } = useSelector((state) => state.categories);

  // Poetry type configuration
  const poemSections = [
    { 
      id: 'ghazal', 
      name: 'Ghazal', 
      icon: '🌙', 
      description: 'Traditional Urdu poetry with rhyming couplets' 
    },
    { 
      id: 'nazm', 
      name: 'Nazm', 
      icon: '📜', 
      description: 'Modern Urdu poetry with structured verses' 
    },
    { 
      id: 'sher', 
      name: 'Sher', 
      icon: '✨', 
      description: 'Couplets from classical poetry' 
    },
    { 
      id: 'other', 
      name: 'Other', 
      icon: '📝', 
      description: 'Various other poetry forms' 
    }
  ];

  // Fetch categories by type when section changes
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearPoemsByCategory());
    dispatch(clearCurrentCategory());
    dispatch(getCategoriesByType(activeSection));
  }, [activeSection, dispatch]);

  // Fetch poems when a category is selected
  const handleCategoryClick = (categoryId) => {
    dispatch(clearError());
    dispatch(fetchPoemsByCategory(categoryId));
    setCurrentCategoryPage(1);
  };

  // Handle search
  const handleSearch = () => {
    if (searchTerm.trim()) {
      dispatch(clearError());
      dispatch(searchPoems(searchTerm));
    }
  };

  // Handle load more for pagination
  const handleLoadMore = () => {
    if (currentCategory?.category?._id && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      dispatch(setCurrentPage(nextPage));
      dispatch(fetchPoemsByCategory({ 
        categoryId: currentCategory.category._id, 
        page: nextPage 
      }));
    }
  };

  // Clear search results
  const handleClearSearch = () => {
    setSearchTerm('');
    dispatch(clearSearchResults());
  };

  // Display poems based on current state
  const displayPoems = searchTerm ? searchResults : poemsByCategory;
  const isLoading = loading || searchLoading || categoriesLoading;

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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className="btn btn-primary join-item"
              onClick={handleSearch}
              disabled={searchLoading}
            >
              {searchLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              Search
            </button>
          </div>
          {searchTerm && (
            <div className="text-center mt-2">
              <button 
                className="btn btn-ghost btn-sm"
                onClick={handleClearSearch}
              >
                Clear Search
              </button>
            </div>
          )}
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
                disabled={categoriesLoading}
              >
                {categoriesLoading && activeSection === section.id ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <span className="text-2xl mr-2">{section.icon}</span>
                )}
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-error max-w-2xl mx-auto mb-8">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => dispatch(clearError())}
            >
              ×
            </button>
          </div>
        )}

        {/* Active Section Info */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-secondary mb-4">
            {poemSections.find(s => s.id === activeSection)?.name}
          </h2>
          <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
            {poemSections.find(s => s.id === activeSection)?.description}
          </p>
        </div>

        {/* Categories List */}
        {!searchTerm && categories.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-center mb-6">
              Browse {activeSection} Categories
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category._id}
                  className={`btn ${
                    currentCategory?.category?._id === category._id 
                      ? 'btn-secondary' 
                      : 'btn-outline btn-secondary'
                  }`}
                  onClick={() => handleCategoryClick(category._id)}
                  disabled={loading}
                >
                  {category.name}
                  {category.stats?.poemCount && (
                    <span className="badge badge-sm ml-2">
                      {category.stats.poemCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Category Info */}
        {currentCategory?.category && (
          <div className="text-center mb-6 p-4 bg-base-200 rounded-lg">
            <h3 className="text-2xl font-bold text-primary">
              {currentCategory.category.name}
            </h3>
            {currentCategory.category.description && (
              <p className="text-base-content/70 mt-2">
                {currentCategory.category.description}
              </p>
            )}
            {currentCategory.pagination && (
              <p className="text-sm text-base-content/60 mt-2">
                Showing {currentCategory.pagination.totalPoems} poems
              </p>
            )}
          </div>
        )}

        {/* Poems Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-lg">
                {searchLoading 
                  ? 'Searching poems...' 
                  : categoriesLoading 
                    ? `Loading ${poemSections.find(s => s.id === activeSection)?.name}...`
                    : 'Loading poems...'
                }
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Search Results Header */}
            {searchTerm && searchResults.length > 0 && (
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">
                  Search Results for "{searchTerm}"
                </h3>
                <p className="text-base-content/60">
                  Found {searchResults.length} poems
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayPoems.map((poem) => (
                <div key={poem._id} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <div className="card-body">
                    {/* Header with title and poet */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="card-title text-2xl group-hover:text-primary transition-colors">
                        {poem.title || 'Untitled Poem'}
                      </h3>
                      {poem.language && (
                        <span className="badge badge-primary badge-lg">{poem.language}</span>
                      )}
                    </div>

                    {/* Poet information */}
                    {poem.poet && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="font-semibold text-primary text-lg">
                          — {poem.poet.name}
                        </span>
                        {poem.poet.era && (
                          <span className="text-sm text-base-content/60">
                            ({poem.poet.era})
                          </span>
                        )}
                      </div>
                    )}

                    {/* Poem content */}
                    <div className="mb-6">
                      <p className="text-base-content/80 italic text-lg leading-relaxed">
                        "{poem.content?.substring(0, 100)}..."
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
                        {poem.views !== undefined && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {poem.views}
                          </div>
                        )}
                        {poem.popularity !== undefined && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            {poem.popularity}
                          </div>
                        )}
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
            {displayPoems.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-base-content mb-2">
                  {searchTerm ? 'No poems found' : 'No poems available'}
                </h3>
                <p className="text-base-content/60 mb-6">
                  {searchTerm 
                    ? `No results for "${searchTerm}"` 
                    : currentCategory?.category
                      ? `No poems found in ${currentCategory.category.name} category`
                      : `Select a ${poemSections.find(s => s.id === activeSection)?.name} category to view poems`
                  }
                </p>
                {searchTerm && (
                  <button 
                    className="btn btn-outline btn-primary"
                    onClick={handleClearSearch}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}

            {/* Load More Button for Pagination */}
            {currentCategory?.pagination?.hasNext && !searchTerm && (
              <div className="text-center">
                <button 
                  className="btn btn-primary btn-outline btn-lg"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Loading...
                    </>
                  ) : (
                    'Load More Poems'
                  )}
                </button>
                <p className="text-sm text-base-content/60 mt-2">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            )}
          </>
        )}

        {/* Quick Stats - You can replace with actual stats from your backend */}
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
              <div className="stat-value text-3xl text-info">4</div>
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
            <Link to="/categories" className="btn btn-outline btn-primary btn-lg">
              Browse All Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poems;