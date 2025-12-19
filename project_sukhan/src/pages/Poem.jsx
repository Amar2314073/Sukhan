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
  getAllCategories, 
  clearCurrentCategory,
  clearError 
} from '../redux/slices/categorySlice';

const Poems = () => {
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState('ghazal');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const [categoryId, setCategoryId] = useState('68f9a60778eba348ff06b978');
  const [language, setLanguage] = useState('hindi');
  const [activeTab, setActiveTab] = useState(1);

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

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // Fetch poems when category changes
  useEffect(() => {
    if (categoryId) {
      dispatch(clearError());
      dispatch(clearPoemsByCategory());
      dispatch(clearCurrentCategory());
      dispatch(fetchPoemsByCategory(categoryId));
    }
  }, [categoryId, dispatch]);

  // Get icon for section type
  const getSectionIcon = (type) => {
    const icons = {
      ghazal: '📜',
      nazm: '📖',
      sher: '✒️',
      ghazals: '📜',
      nazms: '📖',
      poetry: '✍️',
      shayari: '🌸'
    };
    return icons[type] || '📝';
  };

  // Handle category click
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

  // Get current active section object
  const poemSections = categories?.categories || [];
  const activeSectionObj = poemSections.find(s => s.type === activeSection);

  // Get content based on selected language
  const getPoemContent = (poem) => {
    if (!poem.content) return '';
    
    if (typeof poem.content === 'string') {
      return poem.content;
    }
    
    // If content is an object with multiple languages
    if (poem.content[language]) {
      return poem.content[language];
    }
    
    // Fallback to any available language
    return poem.content.urdu || poem.content.hindi || poem.content.roman || '';
  };

  // Get poem language options
  const getAvailableLanguages = (poem) => {
    if (!poem.content || typeof poem.content !== 'object') return [];
    
    const languages = [];
    if (poem.content.urdu) languages.push('urdu');
    if (poem.content.hindi) languages.push('hindi');
    if (poem.content.roman) languages.push('roman');
    return languages;
  };

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800">
      {/* Top Banner - Like Home Page */}
      <div className="bg-gradient-to-r from-amber-100 to-amber-50 border-b border-amber-200 py-4">
        <div className="container mx-auto px-4">
          <div className="text-center mb-2">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-900">
              <span className="border-b-2 border-amber-600 pb-1">Sukhan</span>
              <span className="text-amber-700 text-2xl ml-2">سخن</span>
            </h1>
            <p className="text-amber-800 mt-2 italic">Discover the world of poetry</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-3">
            Poetic Collection
          </h1>
          <p className="text-lg text-amber-700 max-w-3xl mx-auto">
            Explore the rich heritage of Urdu, Hindi, and Persian poetry through carefully curated collections
          </p>
        </div>

        {/* Search Bar - Styled like Home */}
        <div className="max-w-2xl mx-auto mb-8 md:mb-12">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search poems, poets, or verses..." 
              className="w-full px-6 py-3 bg-white border-2 border-amber-200 rounded-full focus:border-amber-400 focus:ring-2 focus:ring-amber-300 focus:outline-none text-gray-700 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-5 py-2 rounded-full hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-sm"
              onClick={handleSearch}
              disabled={searchLoading}
            >
              {searchLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Search'
              )}
            </button>
          </div>
          
          {searchTerm && (
            <div className="text-center mt-3">
              <button 
                className="text-sm text-amber-600 hover:text-amber-800"
                onClick={handleClearSearch}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Poetry Type Navigation - Styled like Home */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {poemSections.map((section) => (
              <button
                key={section._id}
                className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 ${
                  activeSection === section.type 
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg' 
                    : 'bg-white text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
                onClick={() => {
                  setCategoryId(section._id)
                  setActiveSection(section.type)
                }}
                disabled={categoriesLoading}
              >
                {categoriesLoading && activeSection === section.type ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <span className="text-xl">
                    {getSectionIcon(section.type)}
                  </span>
                )}
                <span className="font-medium">{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700">{error}</span>
              <button 
                className="ml-auto text-red-500 hover:text-red-700"
                onClick={() => dispatch(clearError())}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Current Category Info */}
        {currentCategory?.category && !searchTerm && (
          <div className="text-center mb-6 p-6 bg-white rounded-xl shadow-sm border border-amber-100">
            <h2 className="text-2xl font-serif font-bold text-amber-900 mb-3">
              {currentCategory.category.name}
            </h2>
            {currentCategory.category.description && (
              <p className="text-amber-700 mb-3">
                {currentCategory.category.description}
              </p>
            )}
            {currentCategory.pagination && (
              <p className="text-sm text-gray-600">
                Showing {currentCategory.pagination.totalPoems} poems • Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        )}

        {/* Search Results Header */}
        {searchTerm && searchResults.length > 0 && (
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-amber-900 mb-2">
              Search Results for "{searchTerm}"
            </h3>
            <p className="text-gray-600">
              Found {searchResults.length} poems
            </p>
          </div>
        )}

        {/* Poems Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <span className="loading loading-spinner loading-lg text-amber-600"></span>
              <p className="text-lg text-amber-700">
                {searchLoading 
                  ? 'Searching poems...' 
                  : categoriesLoading 
                    ? `Loading ${activeSectionObj?.name || 'poetry'}...`
                    : 'Loading poems...'
                }
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayPoems.map((poem) => {
                const availableLanguages = getAvailableLanguages(poem);
                const content = getPoemContent(poem);
                
                return (
                  <div key={poem._id} className="bg-white rounded-xl shadow-sm border border-amber-100 hover:shadow-lg transition-all duration-300 group overflow-hidden">
                    <div className="p-6">
                      {/* Header with title and poet */}
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-serif text-xl font-bold text-amber-900 group-hover:text-amber-700 transition-colors line-clamp-2">
                          {poem.title || 'Untitled Poem'}
                        </h3>
                        {poem.language && (
                          <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                            {poem.language}
                          </span>
                        )}
                      </div>

                      {/* Poet information */}
                      {poem.poet && (
                        <div className="flex items-center gap-2 mb-4">
                          <span className="font-semibold text-amber-800">
                            — {poem.poet.name}
                          </span>
                          {poem.poet.era && (
                            <span className="text-sm text-gray-600">
                              ({poem.poet.era})
                            </span>
                          )}
                        </div>
                      )}

                      {/* Poem content preview */}
                      <div className="mb-5">
                        <p className="text-gray-600 italic text-base leading-relaxed line-clamp-3 border-l-2 border-amber-200 pl-4 py-2">
                          "{content?.substring(0, 120)}..."
                        </p>
                      </div>

                      {/* Full content with read more */}
                      <div className="mb-5">
                        <div className="collapse collapse-arrow bg-amber-50 rounded-lg">
                          <input type="checkbox" />
                          <div className="collapse-title text-base font-medium text-amber-700 px-4 py-3">
                            Read Full Poem
                          </div>
                          <div className="collapse-content">
                            {/* Language Tabs */}
                            {availableLanguages.length > 1 && (
                              <div className="flex gap-2 mb-4 p-1 bg-white rounded-lg shadow-inner">
                                {availableLanguages.map((lang, index) => (
                                  <button
                                    key={lang}
                                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                                      activeTab === index 
                                        ? 'bg-amber-600 text-white' 
                                        : 'text-gray-600 hover:bg-amber-50'
                                    }`}
                                    onClick={() => setActiveTab(index)}
                                  >
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Poem Content Display */}
                            <div className="space-y-6">
                              {/* Urdu Content */}
                              {poem.content?.urdu && (
                                <div className={`${activeTab !== 0 && availableLanguages.length > 1 ? 'hidden' : ''}`}>
                                  <div className="text-sm font-semibold text-amber-700 mb-2">Urdu</div>
                                  <div dir="rtl" className="text-xl font-urdu text-right leading-relaxed whitespace-pre-line">
                                    {poem.content.urdu}
                                  </div>
                                </div>
                              )}

                              {/* Hindi Content */}
                              {poem.content?.hindi && (
                                <div className={`${activeTab !== 1 && availableLanguages.length > 1 ? 'hidden' : ''}`}>
                                  <div className="text-sm font-semibold text-amber-700 mb-2">Hindi</div>
                                  <div className="text-xl font-hindi leading-relaxed whitespace-pre-line">
                                    {poem.content.hindi}
                                  </div>
                                </div>
                              )}

                              {/* Roman Content */}
                              {poem.content?.roman && (
                                <div className={`${activeTab !== 2 && availableLanguages.length > 1 ? 'hidden' : ''}`}>
                                  <div className="text-sm font-semibold text-amber-700 mb-2">Roman</div>
                                  <div className="text-xl italic leading-relaxed whitespace-pre-line">
                                    {poem.content.roman}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Tags */}
                            {poem.tags && poem.tags.length > 0 && (
                              <div className="mt-6 pt-4 border-t border-amber-200">
                                <div className="flex flex-wrap gap-2">
                                  {poem.tags.map((tag, index) => (
                                    <span key={index} className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stats and actions */}
                      <div className="flex justify-between items-center pt-4 border-t border-amber-100">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {poem.views !== undefined && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              {poem.views}
                            </div>
                          )}
                          {poem.likes !== undefined && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                              {poem.likes}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="text-amber-600 hover:text-amber-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                          <button className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium">
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No results message */}
            {displayPoems.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-5xl text-amber-300 mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {searchTerm ? 'No poems found' : 'No poems available'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm 
                    ? `No results for "${searchTerm}"` 
                    : currentCategory?.category
                      ? `No poems found in ${currentCategory.category.name} category`
                      : `Select a ${activeSectionObj?.name || 'poetry'} category to view poems`
                  }
                </p>
                {searchTerm && (
                  <button 
                    className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
                    onClick={handleClearSearch}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}

            {/* Load More Button for Pagination */}
            {currentCategory?.pagination?.hasNext && !searchTerm && (
              <div className="text-center mt-8">
                <button 
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-sm font-medium"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      <span className="ml-2">Loading...</span>
                    </>
                  ) : (
                    'Load More Poems'
                  )}
                </button>
                <p className="text-sm text-gray-600 mt-3">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            )}
          </>
        )}

        {/* Quick Stats - Like Home Page */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6 md:p-8 mt-8 md:mt-12">
          <h3 className="font-serif text-xl font-bold text-amber-900 mb-6 text-center">Sukhan at a Glance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl mb-2">📖</div>
              <div className="text-2xl md:text-3xl font-bold text-amber-900">10,000+</div>
              <div className="text-sm text-gray-600">Poems</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl mb-2">✍️</div>
              <div className="text-2xl md:text-3xl font-bold text-amber-900">500+</div>
              <div className="text-sm text-gray-600">Poets</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl mb-2">🌍</div>
              <div className="text-2xl md:text-3xl font-bold text-amber-900">3</div>
              <div className="text-sm text-gray-600">Languages</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl mb-2">📚</div>
              <div className="text-2xl md:text-3xl font-bold text-amber-900">4</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        </div>

        {/* Call to Action - Like Home Page */}
        <div className="text-center mt-8 md:mt-12">
          <h3 className="text-xl md:text-2xl font-serif font-bold text-amber-900 mb-4">
            Discover More Poetic Treasures
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore our complete collection of classical and contemporary poetry from master poets across generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/poets" className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-sm font-medium">
              Explore Poets
            </Link>
            <Link to="/categories" className="px-6 py-3 border-2 border-amber-600 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors font-medium">
              Browse All Categories
            </Link>
          </div>
        </div>
      </div>

      {/* Footer CTA - Like Home Page */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-12 md:py-16 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
            Begin Your Journey with Words
          </h2>
          <p className="text-lg text-amber-100 mb-8 max-w-2xl mx-auto">
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

export default Poems;