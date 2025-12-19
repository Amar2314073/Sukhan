import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { 
  fetchAllPoets, 
  searchPoets,
  clearSearchResults,
  setCurrentPage,
  setFilters,
  clearError 
} from '../redux/slices/poetSlice';

const Poets = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [localFilters, setLocalFilters] = useState({
    era: 'all',
    sortBy: 'popular'
  });

  // Redux selectors
  const { 
    poets, 
    searchResults, 
    loading, 
    searchLoading, 
    error,
    currentPage,
    totalPages,
    totalPoets,
    filters,
    pagination
  } = useSelector((state) => state.poets);

  // Fetch poets on component mount and when filters or page change
  useEffect(() => {
    dispatch(fetchAllPoets({ 
      page: currentPage, 
      era: filters.era,
      // sortBy: filters.sortBy
    }));
  }, [dispatch, currentPage, filters.era]);

  // Handle search
  const handleSearch = () => {
    if (searchTerm.trim()) {
      dispatch(searchPoets(searchTerm));
    }
  };

  // Clear search results
  const handleClearSearch = () => {
    setSearchTerm('');
    dispatch(clearSearchResults());
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...localFilters, [filterName]: value };
    setLocalFilters(newFilters);
    dispatch(setFilters(newFilters));
    dispatch(setCurrentPage(1)); // Reset to first page when filter changes
  };

  // Handle load more for pagination
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  // Display poets based on search or filter
  const displayPoets = searchTerm ? searchResults : poets;
  const isLoading = loading || searchLoading;

  // Get poet avatar background color based on name
  const getAvatarColor = (name) => {
    const colors = [
      'bg-gradient-to-br from-amber-600 to-amber-700',
      'bg-gradient-to-br from-amber-500 to-amber-600',
      'bg-gradient-to-br from-yellow-600 to-amber-600',
      'bg-gradient-to-br from-orange-500 to-amber-600'
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  // Get poet era badge color
  const getEraBadgeColor = (era) => {
    if (!era) return 'bg-gray-100 text-gray-800';
    
    if (era.includes('Classical')) {
      return 'bg-purple-100 text-purple-800';
    } else if (era.includes('Modern')) {
      return 'bg-blue-100 text-blue-800';
    } else if (era.includes('Contemporary')) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
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
            <p className="text-amber-800 mt-2 italic">Meet the masters of poetic expression</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-3">
            Master Poets
          </h1>
          <p className="text-lg text-amber-700 max-w-3xl mx-auto">
            Discover legendary poets who have shaped Urdu, Hindi, and Persian literature through their timeless verses
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 md:mb-12">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search poets by name, era, or language..." 
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

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Era Filter */}
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">Era</label>
                <select 
                  className="w-full px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg focus:border-amber-400 focus:ring-1 focus:ring-amber-300 focus:outline-none text-gray-700"
                  value={localFilters.era}
                  onChange={(e) => handleFilterChange('era', e.target.value)}
                >
                  <option value="all">All Eras</option>
                  <option value="Classical">Classical</option>
                  <option value="Modern">Modern</option>
                  <option value="Contemporary">Contemporary</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">Sort By</label>
                <select 
                  className="w-full px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg focus:border-amber-400 focus:ring-1 focus:ring-amber-300 focus:outline-none text-gray-700"
                  value={localFilters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="popular">Most Popular</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="recent">Recently Added</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(localFilters.era !== 'all' || localFilters.sortBy !== 'popular') && (
              <div className="flex flex-wrap gap-2 mt-4">
                {localFilters.era !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                    {localFilters.era}
                    <button onClick={() => handleFilterChange('era', 'all')} className="text-amber-600 hover:text-amber-800">
                      ×
                    </button>
                  </span>
                )}
                {localFilters.sortBy !== 'popular' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                    Sort: {localFilters.sortBy === 'name' ? 'Name (A-Z)' : 'Recently Added'}
                    <button onClick={() => handleFilterChange('sortBy', 'popular')} className="text-amber-600 hover:text-amber-800">
                      ×
                    </button>
                  </span>
                )}
                <button 
                  onClick={() => {
                    handleFilterChange('era', 'all');
                    handleFilterChange('sortBy', 'popular');
                  }}
                  className="text-sm text-amber-600 hover:text-amber-800 ml-auto"
                >
                  Clear All Filters
                </button>
              </div>
            )}
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

        {/* Search Results Header */}
        {searchTerm && searchResults.length > 0 && (
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-amber-900 mb-2">
              Search Results for "{searchTerm}"
            </h3>
            <p className="text-gray-600">
              Found {searchResults.length} poets
            </p>
          </div>
        )}

        {/* Poets Grid */}
        {isLoading && poets.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <span className="loading loading-spinner loading-lg text-amber-600"></span>
              <p className="text-lg text-amber-700">
                Loading poets...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {displayPoets.map((poet) => (
                <div key={poet._id} className="bg-white rounded-xl shadow-sm border border-amber-100 hover:shadow-lg transition-all duration-300 group overflow-hidden">
                  <div className="p-6">
                    {/* Poet Avatar and Name */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${getAvatarColor(poet.name)}`}>
                        {poet.name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-amber-900 group-hover:text-amber-700 transition-colors">
                          {poet.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{poet.era}</p>
                      </div>
                    </div>

                    {/* Poet Info */}
                    <div className="space-y-3 mb-4">
                      {/* Era Badge */}
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Era</div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getEraBadgeColor(poet.era)}`}>
                          {poet.era || 'Unknown Era'}
                        </span>
                      </div>

                      {/* Bio Preview */}
                      {poet.bio && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Bio</div>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {poet.bio}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-6 py-4 border-t border-b border-amber-100">
                      <div className="text-center">
                        <div className="text-lg md:text-xl font-bold text-amber-900">
                          {poet.stats?.poemCount || 0}
                        </div>
                        <div className="text-xs text-gray-600">Poems</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg md:text-xl font-bold text-amber-900">
                          {poet.stats?.totalViews || 0}
                        </div>
                        <div className="text-xs text-gray-600">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg md:text-xl font-bold text-amber-900">
                          {poet.popular ? 'High' : 'Low'}
                        </div>
                        <div className="text-xs text-gray-600">Popularity</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link 
                        to={`/poets/${poet._id}`}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-200 text-center font-medium"
                      >
                        View Profile
                      </Link>
                      <button className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No results message */}
            {displayPoets.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-5xl text-amber-300 mb-4">✍️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {searchTerm ? 'No poets found' : 'No poets available'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm 
                    ? `No results for "${searchTerm}"` 
                    : 'Try adjusting your filters to see more poets'
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
            {!searchTerm && pagination?.hasNext && (
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
                    'Load More Poets'
                  )}
                </button>
                <p className="text-sm text-gray-600 mt-3">
                  Showing {poets.length} of {totalPoets} poets • Page {currentPage} of {totalPages}
                </p>
              </div>
            )}
          </>
        )}

        {/* Quick Stats - Like Home Page */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6 md:p-8 mt-8 md:mt-12">
          <h3 className="font-serif text-xl font-bold text-amber-900 mb-6 text-center">Poets at a Glance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl mb-2">✍️</div>
              <div className="text-2xl md:text-3xl font-bold text-amber-900">{totalPoets || 500}+</div>
              <div className="text-sm text-gray-600">Poets</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl mb-2">📚</div>
              <div className="text-2xl md:text-3xl font-bold text-amber-900">10,000+</div>
              <div className="text-sm text-gray-600">Total Poems</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl mb-2">🌍</div>
              <div className="text-2xl md:text-3xl font-bold text-amber-900">4</div>
              <div className="text-sm text-gray-600">Languages</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl mb-2">⏳</div>
              <div className="text-2xl md:text-3xl font-bold text-amber-900">3</div>
              <div className="text-sm text-gray-600">Eras Covered</div>
            </div>
          </div>
        </div>

        {/* Call to Action - Like Home Page */}
        <div className="text-center mt-8 md:mt-12">
          <h3 className="text-xl md:text-2xl font-serif font-bold text-amber-900 mb-4">
            Want to Read Their Poetry?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Dive deep into the poetic world of these legendary masters and discover their timeless verses.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/poems" className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-sm font-medium">
              Explore Poems
            </Link>
            <Link to="/collections" className="px-6 py-3 border-2 border-amber-600 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors font-medium">
              Browse Collections
            </Link>
          </div>
        </div>
      </div>

      {/* Footer CTA - Like Home Page */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-12 md:py-16 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
            Join Our Community of Poetry Lovers
          </h2>
          <p className="text-lg text-amber-100 mb-8 max-w-2xl mx-auto">
            Connect with fellow poetry enthusiasts, share your favorite verses, and discover new poetic talents.
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

export default Poets;