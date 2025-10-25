import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'HI', name: 'हिन्दी' },
    { code: 'UR', name: 'اردو' }
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className={`navbar sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-base-100/95 backdrop-blur-lg shadow-lg border-b border-base-300' 
        : 'bg-base-100'
    }`}>
      {/* Mobile Menu */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>Home</a></li>
            <li><a>Poets</a></li>
            <li><a>Poems</a></li>
            <li><a>Collections</a></li>
            <li><a>Dictionary</a></li>
            {user ? (
              <>
                <li><a>My Profile</a></li>
                <li><a>My Collections</a></li>
                <li><a>Favorites</a></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <>
                <li><a>Login</a></li>
                <li><a>Sign Up</a></li>
              </>
            )}
          </ul>
        </div>
        
        {/* Logo */}
        <a className="btn btn-ghost text-xl font-bold text-primary">
          <span className="text-2xl">📖</span>
          Sukhan
        </a>
      </div>

      {/* Desktop Menu - Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium">
          <li><a className="hover:text-primary transition-colors">Home</a></li>
          <li><a className="hover:text-primary transition-colors">Poets</a></li>
          <li><a className="hover:text-primary transition-colors">Poems</a></li>
          <li><a className="hover:text-primary transition-colors">Collections</a></li>
          <li><a className="hover:text-primary transition-colors">Dictionary</a></li>
        </ul>
      </div>

      {/* Right Side - Desktop */}
      <div className="navbar-end gap-2">
        
        {/* Language Selector */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm font-medium">
            {currentLang}
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
            {languages.map((lang) => (
              <li key={lang.code}>
                <button 
                  onClick={() => setCurrentLang(lang.code)}
                  className={`justify-between ${currentLang === lang.code ? 'active' : ''}`}
                >
                  {lang.name}
                  {currentLang === lang.code && (
                    <span className="badge badge-primary badge-xs"></span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Theme Toggle */}
        <label className="swap swap-rotate btn btn-ghost btn-sm">
          <input type="checkbox" className="theme-controller" value="dark" />
          <svg className="swap-off w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
          </svg>
          <svg className="swap-on w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.5,5.5,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
          </svg>
        </label>

        {/* Search Icon */}
        <button className="btn btn-ghost btn-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* User Section */}
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-semibold">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span>Welcome, {user.name || 'User'}</span>
              </li>
              <li><a>My Profile</a></li>
              <li><a>My Collections</a></li>
              <li><a>Favorites</a></li>
              <li className="divider"></li>
              <li><button onClick={handleLogout} className="text-error">Logout</button></li>
            </ul>
          </div>
        ) : (
          <div className="hidden sm:flex gap-2">
            <button className="btn btn-ghost btn-sm">Login</button>
            <button className="btn btn-primary btn-sm">Sign Up</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;