import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { NavLink, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { Mic, Search, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../context/themeContext';


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [langOpen, setLangOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const zenMode = useSelector(state => state.ui.zenMode);

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';


  const langRef = useRef(null);
  const profileRef = useRef(null);

  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error('Voice search not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;

    setListening(true);
    const toastId = toast.loading('Listening… Speak your search');

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;

      setSearchQuery(spokenText);

      toast.dismiss(toastId);
      toast.success(`Searching for “${spokenText}”`);
      setListening(false);

      // optional: auto-search
      navigate(`/search?q=${encodeURIComponent(spokenText)}`);
    };

    recognition.onerror = () => {
      toast.dismiss(toastId);
      toast.error('Could not hear clearly');
      setListening(false);
    };

    recognition.onend = () => {
      toast.dismiss(toastId);
      setListening(false);
    };

    recognition.start();
  };


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileMenuOpen(false);
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
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileSearchOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/', { replace: true });
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    setLangOpen(false);
  };

  const getNavLinkClass = ({ isActive }) =>
    `px-4 py-2 font-medium text-sm transition
    ${isActive
      ? 'text-primary border-b-2 border-primary'
      : 'text-base-content/70 hover:text-base-content'
    }`;

   // Default profile image (white silhouette)
  const defaultProfileImage = (
    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12 2.25a5.25 5.25 0 00-5.25 5.25c0 1.92.932 3.615 2.366 4.675a8.25 8.25 0 105.768 0A5.247 5.247 0 0017.25 7.5 5.25 5.25 0 0012 2.25zM12 15a6 6 0 00-6 6h12a6 6 0 00-6-6z" clipRule="evenodd" />
    </svg>
  );

  return (
    <nav
      className={`
        sticky top-0 z-50
        transition-all duration-900 ease-in-out
        ${zenMode
          ? '-translate-y-full h-0 overflow-hidden'
          : 'translate-y-0 h-16'}
        ${isScrolled
          ? 'bg-base-100/95 backdrop-blur border-b border-base-300/40 shadow-[0_12px_40px_rgba(0,0,0,0.6)]'
          : 'bg-base-100'}
      `}
    >

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-2xl text-primary">📖</span>
            <div>
              <div className="font-serif text-xl font-bold text-base-content">Sukhan</div>
              <div className="font-serif text-xs text-base-content/60 -mt-1">سخن</div>
            </div>
          </NavLink>

          {/* CENTER LINKS */}
          <div className="hidden md:flex items-center">
            <NavLink to="/" className={getNavLinkClass}>{t('home')}</NavLink>
            <NavLink to="/poets" className={getNavLinkClass}>{t('poets')}</NavLink>
            <NavLink to="/poems" className={getNavLinkClass}>{t('poems')}</NavLink>
            <NavLink to="/collections" className={getNavLinkClass}>{t('collections')}</NavLink>
            <NavLink to="/dictionary" className={getNavLinkClass}>{t('dictionary')}</NavLink>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* MOBILE SEARCH ICON */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 rounded-full bg-base-200 hover:bg-base-300"
            >
              <svg className="w-5 h-5 text-base-content/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* DESKTOP SEARCH */}
            <div className="hidden md:block relative">
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search poems, poets…"
                className="
                  input input-bordered input-sm w-64
                  bg-base-200/60 border-base-300/40
                  text-base-content placeholder:text-base-content/90
                  pr-16
                "
              />

              {/* MIC BUTTON */}
              <button
                onClick={startVoiceSearch}
                className={`
                  absolute right-8 top-1/2 -translate-y-1/2
                  cursor-pointer
                  transition
                  ${listening
                    ? 'text-error animate-pulse'
                    : 'text-base-content/80 hover:text-primary'}
                `}
                title="Voice search"
              >
                <Mic size={16} />
              </button>

              {/* SEARCH ICON */}
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2
                  cursor-pointer
                  text-base-content/80 hover:text-base-content/60"
              >
                <Search size={14} />
              </button>
            </div>

            {/* THEME TOGGLE */}
            <div className="flex items-center">
              <label className="swap swap-rotate cursor-pointer">

                {/* hidden checkbox */}
                <input
                  type="checkbox"
                  checked={isDark}
                  onChange={toggleTheme}
                />

                <Moon
                  size={20}
                  className="swap-off text-base-content/80"
                />

                <Sun
                  size={20}
                  className="swap-on text-base-content/80"
                />

              </label>
            </div>


            {/* LANGUAGE */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="px-3 py-1.5 rounded-lg bg-base-200 hover:bg-base-300 text-sm"
              >
                {languages.find(l => l.code === currentLang)?.label}
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-base-100 border border-base-300/40 rounded-lg shadow-xl">
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => changeLanguage(l.code)}
                      className="block w-full px-4 py-2 text-left hover:bg-base-200"
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PROFILE */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-9 h-9 rounded-full bg-base-300 flex items-center justify-center"
              >
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-base-100 border border-base-300/40 rounded-xl shadow-2xl z-50">
                  {user ? (
                    <>
                      <div className="p-4 border-b border-base-300/40 bg-base-200/40">
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
                              <p className="font-semibold bg-base-content-90">{user.name}</p>
                              <p className="text-xs bg-base-content-80">{user.email}</p>
                            </div>
                          </div>
                      </div>

                      <NavLink
                        to="/profile" 
                        onClick={() => setProfileMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 transition duration-200">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>My Profile</span>
                      </NavLink>
                      <NavLink 
                        to="/my-collections" 
                        onClick={() => setProfileMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 transition-duration-200"
                      >
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span>My Collections</span>
                      </NavLink>
                      <NavLink 
                        to="/favorites" 
                        onClick={() => setProfileMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 transition-duration-200"
                      >
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>Favorites</span>
                      </NavLink>
                      <NavLink 
                        to="/settings" 
                        onClick={() => setProfileMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 transition-duration-200"
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
                          className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 border-t border-base-300/40">
                          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          </svg>
                          <span>Admin Panel</span>
                        </NavLink>
                      )}

                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-error hover:bg-error/10 border-t border-base-300/40">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-4 border-b border-amber-100 bg-gradient-to-r from-gray-900 to-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                            {defaultProfileImage}
                          </div>
                          <div>
                            <p className="font-semibold text-base-content/90">Welcome Guest</p>
                            <p className="text-xs text-base-content/70">Login to access all features</p>
                          </div>
                        </div>
                      </div>
                      <NavLink 
                        to="/login" 
                        onClick={() => setProfileMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-base-200">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span>Login</span>
                      </NavLink>
                      <NavLink 
                        to="/register" 
                        onClick={() => setProfileMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-base-200">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span>Sign Up</span>
                      </NavLink>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* MOBILE MENU */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-xl">
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH BAR */}
      {mobileSearchOpen && (
        <div className="block relative md:hidden px-4 py-3 border-b border-base-300/40">
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search poems, poets…"
            className="w-full px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40 pr-14"
          />

          {/* MIC */}
          <button
            onClick={startVoiceSearch}
            className={`
              absolute right-12 top-1/2 -translate-y-1/2
              ${listening ? 'text-error animate-pulse' : 'text-base-content/80'}
            `}
          >
            <Mic size={18} />
          </button>

          {/* SEARCH ICON */}
          <button
            className="absolute right-5 top-1/2 -translate-y-1/2 text-base-content/80"
          >
            <Search size={16} />
          </button>
        </div>

      )}

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-base-100 border-t border-base-300/40">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-base-200">Home</NavLink>
          <NavLink to="/poets" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-base-200">Poets</NavLink>
          <NavLink to="/poems" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-base-200">Poems</NavLink>
          <NavLink to="/collections" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-base-200">Collections</NavLink>
          <NavLink to="/dictionary" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-base-200">Dictionary</NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
