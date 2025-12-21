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
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const langRef = useRef(null);
  const profileRef = useRef(null);

  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    `px-4 py-2 font-medium text-sm transition
    ${isActive
      ? 'text-primary border-b-2 border-primary'
      : 'text-base-content/70 hover:text-base-content'
    }`;

  return (
    <nav
      className={`
        sticky top-0 z-50 transition-all duration-300
        ${isScrolled
          ? 'bg-base-100/95 backdrop-blur border-b border-base-300/40 shadow-[0_12px_40px_rgba(0,0,0,0.6)]'
          : 'bg-base-100'
        }
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

            {/* 🔍 MOBILE SEARCH ICON */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="
              md:hidden
              p-2 rounded-full
              bg-base-200
              hover:bg-base-300
              transition
            "
          >
            <svg
              className="w-5 h-5 text-base-content/80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
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
                  bg-base-200/60
                  border-base-300/40
                  text-base-content
                  placeholder:text-base-content/90
                  focus:ring-2 focus:ring-primary/40
                "
              />
            </div>

            {/* LANGUAGE */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="px-3 py-1.5 rounded-lg bg-base-200 hover:bg-base-300 text-base-content text-sm"
              >
                {languages.find(l => l.code === currentLang)?.label}
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-base-100 border border-base-300/40 rounded-lg shadow-xl">
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => changeLanguage(l.code)}
                      className="block w-full px-4 py-2 text-left text-base-content/80 hover:bg-base-200"
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
                className="w-9 h-9 rounded-full bg-base-300 text-base-content flex items-center justify-center"
              >
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-base-100 border border-base-300/40 rounded-xl shadow-2xl">
                  {user ? (
                    <>
                      <div className="p-4 border-b border-base-300/40">
                        <div className="font-semibold text-base-content">{user.name}</div>
                        <div className="text-xs text-base-content/60">{user.email}</div>
                      </div>

                      {user.role === 'admin' && (
                        <NavLink to="/admin" className="block px-4 py-3 hover:bg-base-200">
                          Admin Panel
                        </NavLink>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-error hover:bg-error/10 border-t border-base-300/40"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <NavLink to="/login" className="block px-4 py-3 hover:bg-base-200">
                      Login
                    </NavLink>
                  )}
                </div>
              )}
            </div>

            {/* MOBILE */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              ☰
            </button>

          </div>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="
          md:hidden
          bg-base-100
          border-b border-base-300/40
          px-4 py-3
        ">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                setMobileSearchOpen(false);
              }
            }}
            placeholder="Search poems, poets…"
            className="
              w-full
              px-4 py-2
              rounded-lg
              bg-base-200/60
              border border-base-300/40
              text-base-content
              placeholder:text-base-content/90
              focus:outline-none
              focus:ring-2 focus:ring-primary/40
            "
          />
        </div>
      )}


      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-base-100 border-t border-base-300/40">
          <NavLink to="/" className="block px-4 py-3 hover:bg-base-200">Home</NavLink>
          <NavLink to="/poets" className="block px-4 py-3 hover:bg-base-200">Poets</NavLink>
          <NavLink to="/poems" className="block px-4 py-3 hover:bg-base-200">Poems</NavLink>
          <NavLink to="/collections" className="block px-4 py-3 hover:bg-base-200">Collections</NavLink>
          <NavLink to="/dictionary" className="block px-4 py-3 hover:bg-base-200">Dictionary</NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
