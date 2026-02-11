import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { NavLink, useNavigate } from 'react-router';
import { Search, Sun, Moon, LogIn, UserPlus, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext'
import {
  FaMicrophone,
  FaUser,
  FaHeart,
  FaBook,
  FaCog,
  FaSignOutAlt,
  FaPenNib,
  FaShieldAlt,
  FaUserCircle
} from "react-icons/fa";



const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const zenMode = useSelector(state => state.ui.zenMode);

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';


  const profileRef = useRef(null);

  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const voiceRecognitionRef = useRef(null);

  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error('Voice search not supported');
      return;
    }

    if(listening || voiceRecognitionRef.current) {
      voiceRecognitionRef.current.stop();
      voiceRecognitionRef.current = null;
      setListening(false);
      toast.dismiss();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;

    voiceRecognitionRef.current = recognition;
    setListening(true);
    const toastId = toast.loading('Listening… Speak your search');

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;

      setSearchQuery(spokenText);
      setListening(false);
      voiceRecognitionRef.current = null;

      toast.dismiss(toastId);
      toast.success(`Searching for “${spokenText}”`);

      // optional: auto-search
      navigate(`/search?q=${encodeURIComponent(spokenText)}`);

      setMobileSearchOpen(false);
      setSearchQuery('');
    };

    recognition.onerror = () => {
      toast.dismiss(toastId);
      setListening(false);
      voiceRecognitionRef.current = null;
      toast.error('Could not hear clearly');
    };

    recognition.onend = () => {
      toast.dismiss(toastId);
      setListening(false);
      voiceRecognitionRef.current = null;
    };

    recognition.start();
  };


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



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


  const getNavLinkClass = ({ isActive }) =>
    `px-4 py-2 font-medium text-sm transition
    ${isActive
      ? 'text-primary border-b-2 border-primary'
      : 'text-base-content/70 hover:text-base-content'
    }`;


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
          <NavLink to="/" title='Sukhan - Urdu and Hindi Poetry Platform' className="flex items-center gap-2">
            <span className="text-2xl text-primary">📖</span>
            <div>
              <div className="font-serif text-xl font-bold text-base-content">Sukhan</div>
              <div className="font-serif text-xs text-base-content/60 -mt-1">سخن</div>
            </div>
          </NavLink>

          {/* CENTER LINKS */}
          <div className="hidden md:flex items-center">
            <NavLink to="/" className={getNavLinkClass}>Home</NavLink>
            <NavLink to="/poets" className={getNavLinkClass}>Poets</NavLink>
            <NavLink to="/poems" className={getNavLinkClass}>Poems</NavLink>
            <NavLink to="/collections" className={getNavLinkClass}>Collections</NavLink>
            {/* <NavLink to="/dictionary" className={getNavLinkClass}>Dictionary</NavLink> */}
            <NavLink to="/books/explore" className={getNavLinkClass}>Books</NavLink>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* MOBILE SEARCH ICON */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 rounded-full bg-base-200 hover:bg-base-300"
            >
              <Search size={16} />
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
                  absolute right-4 top-1/2 -translate-y-1/2
                  cursor-pointer
                  transition
                  ${listening
                    ? 'text-error animate-pulse'
                    : 'text-base-content/80 hover:text-primary'}
                `}
                title="Voice search"
              >
                <FaMicrophone size={16} />
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

            {/* PROFILE */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-9 h-9 rounded-full bg-base-300 flex items-center justify-center overflow-hidden"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle size={24} className="text-base-content/70" />
                )}
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-base-100 border border-base-300/40 rounded-xl shadow-2xl z-50">
                  {user ? (
                    <>
                      <div className="p-4 border-b border-base-300/40 bg-base-200/40">
                        <div className="flex items-center gap-3">
                            {user?.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={user.name} 
                                className="w-10 h-10 rounded-full object-cover border border-base-300"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary text-primary-content 
                               flex items-center justify-center font-semibold">
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-base-content/90">{user.name}</p>
                              <p className="text-xs text-base-content/70">{user.email}</p>
                            </div>
                          </div>
                      </div>

                      <NavLink
                        to="/profile" 
                        onClick={() => setProfileMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 transition duration-200">
                        <FaUser className="text-primary" />

                        <span>My Profile</span>
                      </NavLink>

                      {/* <NavLink 
                        to="/my-collections" 
                        onClick={() => setProfileMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 transition-duration-200"
                      >
                        <FaBook className="text-amber-600" />

                        <span>My Collections</span>
                      </NavLink> */}

                      {/* <NavLink 
                        to="/favorites" 
                        onClick={() => setProfileMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 transition-duration-200"
                      >
                        <FaHeart className="text-amber-600" />

                        <span>Favorites</span>
                      </NavLink> */}

                      {/* <NavLink 
                        to="/settings" 
                        onClick={() => setProfileMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 transition-duration-200"
                      >
                        <FaCog className="text-amber-600" />
                        <span>Settings</span>
                      </NavLink> */}

                      {user.role === 'admin' && (
                        <NavLink 
                          to="/admin" 
                          onClick={() => setProfileMenuOpen(false)} 
                          className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 border-t border-base-300/40">
                          <FaPenNib className="text-primary" />
                          <span>Admin Panel</span>
                        </NavLink>
                      )}

                      {user?.isPoetOwner && (
                        <NavLink
                          to="/poet-owner"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 transition"
                        >
                          <FaPenNib className="text-amber-600" />
                          <span>Poet Dashboard</span>
                        </NavLink>
                      )}

                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-error hover:bg-error/10 border-t border-base-300/40">
                        <FaShieldAlt className="text-primary" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-4 border-b border-base-300 bg-base-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center">
                                <FaUserCircle size={36}/>
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
                        <LogIn size={16} />
                        <span>Login</span>
                      </NavLink>
                      <NavLink 
                        to="/register" 
                        onClick={() => setProfileMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-base-200">
                        <UserPlus size={16} />
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
              absolute right-8 top-1/2 -translate-y-1/2
              ${listening ? 'text-error animate-pulse' : 'text-base-content/80'}
            `}
          >
            <FaMicrophone size={18} />
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
          {/* <NavLink to="/dictionary" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-base-200">Dictionary</NavLink> */}
          <NavLink to="/books/explore" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 hover:bg-base-200">Books</NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
