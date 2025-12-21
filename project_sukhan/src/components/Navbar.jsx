import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { NavLink, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [langOpen, setLangOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const langRef = useRef(null);
  const profileRef = useRef(null);
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'hi', label: 'HI', name: 'हिन्दी' },
    { code: 'ur', label: 'UR', name: 'اردو' },
  ];

    const handleSearch = (e) => {
    if ((e.key === 'Enter') && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      }
    };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    setProfileMenuOpen(false);
  };

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    setLangOpen(false);
  };

  const getNavLinkClass = ({ isActive }) =>
    `px-4 py-2 transition-colors duration-200 font-medium text-sm
    ${isActive
      ? 'text-amber-700 font-semibold border-b-2 border-amber-600'
      : 'text-gray-700 hover:text-amber-700'
    }`;

  // Default profile image (white silhouette)
  const defaultProfileImage = (
    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12 2.25a5.25 5.25 0 00-5.25 5.25c0 1.92.932 3.615 2.366 4.675a8.25 8.25 0 105.768 0A5.247 5.247 0 0017.25 7.5 5.25 5.25 0 0012 2.25zM12 15a6 6 0 00-6 6h12a6 6 0 00-6-6z" clipRule="evenodd" />
    </svg>
  );

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-white/95 backdrop-blur shadow-lg border-b border-amber-100' 
        : 'bg-amber-50'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-2xl text-amber-700">📖</span>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold text-amber-900 tracking-tight">Sukhan</span>
              <span className="font-serif text-xs text-amber-700 -mt-1 tracking-wider">سخن</span>
            </div>
          </NavLink>

          {/* CENTER MENU */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={getNavLinkClass}>{t('home')}</NavLink>
            <NavLink to="/poets" className={getNavLinkClass}>{t('poets')}</NavLink>
            <NavLink to="/poems" className={getNavLinkClass}>{t('poems')}</NavLink>
            <NavLink to="/collections" className={getNavLinkClass}>{t('collections')}</NavLink>
            <NavLink to="/dictionary" className={getNavLinkClass}>{t('dictionary')}</NavLink>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4">

          {/* 🔍 Mobile Search Icon */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 rounded-full hover:bg-amber-100"
          >
            <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* ☰ Mobile Hamburger */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}

            className="md:hidden p-2 rounded-full hover:bg-amber-100"
          >
            <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

            

            {/* 🔍 SEARCH BOX */}
            <div className="hidden md:block relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder={
                  currentLang === 'hi'
                    ? 'तलाश कीजिए'
                    : currentLang === 'ur'
                    ? 'تلاش کیجیے'
                    : 'Search poems, poets...'
                }
                className="input input-bordered input-sm w-64 bg-white border-amber-200 
                focus:border-amber-400 focus:ring-1 focus:ring-amber-300 
                placeholder-gray-400 text-gray-700"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 
              text-amber-600 hover:text-amber-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* 🌐 LANGUAGE DROPDOWN */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg 
                bg-amber-100 hover:bg-amber-200 text-amber-800 
                font-medium text-sm transition-colors duration-200"
              >
                <span className="font-semibold">
                  {languages.find(l => l.code === currentLang)?.label}
                </span>
                <svg className={`w-4 h-4 transition-transform ${langOpen ? 'rotate-180' : ''}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl 
                border border-amber-100 z-50 overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`block w-full text-left px-4 py-3 hover:bg-amber-50 
                      transition-colors duration-150 border-b border-amber-50 last:border-b-0
                      ${currentLang === lang.code 
                        ? 'bg-amber-50 text-amber-700 font-semibold' 
                        : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{lang.name}</span>
                        {currentLang === lang.code && (
                          <span className="text-amber-600">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 👤 PROFILE ICON (थीम बटन की जगह) */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="p-2 rounded-full hover:bg-amber-100 transition-colors duration-200 shadow-0"
                aria-label="Profile menu"
              >
                {user ? (
                  user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={user.name || 'User'} 
                      className="w-8 h-8 min-w-8 min-h-8 rounded-full object-cover border border-amber-200 aspect-square"
                    />
                  ) : (
                    <div className="w-8 h-8 min-w-8 min-h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 
                    text-white flex items-center justify-center font-semibold text-sm aspect-square">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )
                ) : (
                  defaultProfileImage
                )}
              </button>

              {/* PROFILE DROPDOWN MENU */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl 
                border border-amber-100 z-50 overflow-hidden">
                  {user ? (
                    <>
                      {/* यूजर लॉग इन है */}
                      <div className="p-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white">
                        <div className="flex items-center gap-3">
                          {user.profileImage ? (
                            <img 
                              src={user.profileImage} 
                              alt={user.name} 
                              className="w-10 h-10 rounded-full object-cover border border-amber-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 
                            text-white flex items-center justify-center font-semibold">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <NavLink 
                          to="/profile" 
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 
                          transition-colors duration-150"
                        >
                          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>My Profile</span>
                        </NavLink>
                        
                        <NavLink 
                          to="/my-collections" 
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 
                          transition-colors duration-150"
                        >
                          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <span>My Collections</span>
                        </NavLink>
                        
                        <NavLink 
                          to="/favorites" 
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 
                          transition-colors duration-150"
                        >
                          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>Favorites</span>
                        </NavLink>
                        
                        <NavLink 
                          to="/settings" 
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 
                          transition-colors duration-150"
                        >
                          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          </svg>
                          <span>Settings</span>
                        </NavLink>
                        
                        {user.role === 'admin' && (
                          <NavLink 
                            to="/admin" 
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 
                            transition-colors duration-150 border-t border-amber-100 mt-2"
                          >
                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            </svg>
                            <span>Admin Panel</span>
                          </NavLink>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 
                          w-full text-left transition-colors duration-150 border-t border-amber-100 mt-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                            {defaultProfileImage}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Welcome Guest</p>
                            <p className="text-xs text-gray-600">Login to access all features</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <NavLink 
                          to="/login" 
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 
                          transition-colors duration-150"
                        >
                          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          <span>Login</span>
                        </NavLink>
                        
                        <NavLink 
                          to="/register" 
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 
                          transition-colors duration-150"
                        >
                          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          <span>Sign Up</span>
                        </NavLink>
                        
                        <NavLink
                          to='/profile'
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 
                          transition-colors duration-150 border-t border-amber-100 mt-2"
                        >
                          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Profile</span>
                        </NavLink>
                        
                        {/* <NavLink 
                          to="/explore" 
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 
                          transition-colors duration-150 border-t border-amber-100 mt-2"
                        >
                          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span>Explore as Guest</span>
                        </NavLink> */}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    {/* 📱 Mobile Search Bar */}
    {mobileSearchOpen && (
      <div className="md:hidden relative bg-white border-b border-amber-100 px-4 py-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
              setMobileSearchOpen(false);
            }
          }}
          placeholder={
            currentLang === 'hi'
              ? 'तलाश कीजिए'
              : currentLang === 'ur'
              ? 'تلاش کیجیے'
              : 'Search poems, poets...'
            }
          className="w-full input input-bordered input-sm 
          bg-white border-amber-200 focus:border-amber-400 text-base-100 placeholder-gray-400"
        />
        <button
          onClick={() => {
            if (searchQuery.trim()) {
              navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
              setMobileSearchOpen(false);
            }
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
      )}
    
      {/* 📱 Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-amber-100 shadow">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 text-gray-700 hover:bg-amber-50">
            {t('home')}
          </NavLink>
          <NavLink to="/poets" onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 text-gray-700 hover:bg-amber-50">
            {t('poets')}
          </NavLink>
          <NavLink to="/poems" onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 text-gray-700 hover:bg-amber-50">
            {t('poems')}
          </NavLink>
          <NavLink to="/collections" onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 text-gray-700 hover:bg-amber-50">
            {t('collections')}
          </NavLink>
          <NavLink to="/dictionary" onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 text-gray-700 hover:bg-amber-50">
            {t('dictionary')}
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;