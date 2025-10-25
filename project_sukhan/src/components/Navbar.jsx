import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { NavLink, useNavigate } from 'react-router';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    dispatch(logoutUser());
    navigate('/');
  };

  // Active link style function
  const getNavLinkClass = ({ isActive }) => 
    `hover:text-primary transition-colors ${isActive ? 'text-primary font-semibold' : ''}`;

  const getMobileNavLinkClass = ({ isActive }) => 
    `${isActive ? 'active font-semibold' : ''}`;

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
            <li><NavLink to="/" className={getMobileNavLinkClass}>Home</NavLink></li>
            <li><NavLink to="/poets" className={getMobileNavLinkClass}>Poets</NavLink></li>
            <li><NavLink to="/poems" className={getMobileNavLinkClass}>Poems</NavLink></li>
            <li><NavLink to="/collections" className={getMobileNavLinkClass}>Collections</NavLink></li>
            <li><NavLink to="/dictionary" className={getMobileNavLinkClass}>Dictionary</NavLink></li>
            {user ? (
              <>
                <li><NavLink to="/profile" className={getMobileNavLinkClass}>My Profile</NavLink></li>
                <li><NavLink to="/my-collections" className={getMobileNavLinkClass}>My Collections</NavLink></li>
                <li><NavLink to="/favorites" className={getMobileNavLinkClass}>Favorites</NavLink></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <>
                <li><NavLink to="/login" className={getMobileNavLinkClass}>Login</NavLink></li>
                <li><NavLink to="/register" className={getMobileNavLinkClass}>Sign Up</NavLink></li>
              </>
            )}
          </ul>
        </div>
        
        {/* Logo */}
        <NavLink to="/" className="btn btn-ghost text-xl font-bold text-primary">
          <span className="text-2xl">📖</span>
          Sukhan
        </NavLink>
      </div>

      {/* Desktop Menu - Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium">
          <li><NavLink to="/" className={getNavLinkClass}>Home</NavLink></li>
          <li><NavLink to="/poets" className={getNavLinkClass}>Poets</NavLink></li>
          <li><NavLink to="/poems" className={getNavLinkClass}>Poems</NavLink></li>
          <li><NavLink to="/collections" className={getNavLinkClass}>Collections</NavLink></li>
          <li><NavLink to="/dictionary" className={getNavLinkClass}>Dictionary</NavLink></li>
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
        <NavLink to="/search" className="btn btn-ghost btn-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </NavLink>

        {/* User Section - This is where the profile avatar/dropdown is */}
        {user ? (
          <div className="dropdown dropdown-end">
            {/* CLICKABLE PROFILE AVATAR - This is what users click to open the popup */}
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-semibold">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            
            {/* PROFILE POPUP CARD - This appears when avatar is clicked */}
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-64">
              {/* User Info Card */}
              <div className="px-4 py-3 border-b border-base-300">
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="w-12 rounded-full bg-primary text-primary-content flex items-center justify-center text-lg font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-base-content">{user.name || 'User'}</p>
                    <p className="text-sm text-base-content/70">{user.email}</p>
                    {user.role === 'admin' && (
                      <span className="badge badge-success badge-sm mt-1">Admin</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <li className="mt-2">
                <NavLink to="/profile" className={getMobileNavLinkClass}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-collections" className={getMobileNavLinkClass}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  My Collections
                </NavLink>
              </li>
              <li>
                <NavLink to="/favorites" className={getMobileNavLinkClass}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Favorites
                </NavLink>
              </li>
              
              {/* Admin Panel (if admin) */}
              {user.role === 'admin' && (
                <li>
                  <NavLink to="/admin" className={getMobileNavLinkClass}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Admin Panel
                  </NavLink>
                </li>
              )}

              {/* Settings */}
              <li>
                <NavLink to="/settings" className={getMobileNavLinkClass}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </NavLink>
              </li>

              <li className="divider mt-2 mb-2"></li>

              {/* Logout */}
              <li>
                <button onClick={handleLogout} className="text-error justify-between">
                  <span>Logout</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="hidden sm:flex gap-2">
            <NavLink to="/login" className="btn btn-ghost btn-sm">Login</NavLink>
            <NavLink to="/register" className="btn btn-primary btn-sm">Sign Up</NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;