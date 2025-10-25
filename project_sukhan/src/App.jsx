import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getProfile } from './redux/slices/authSlice';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login'
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Poems from './pages/Poem';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(getProfile());
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/poems" element={<Poems />} />
            {/* Add other routes as you create them */}
            {/* <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/poets" element={<Poets />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/dictionary" element={<Dictionary />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;