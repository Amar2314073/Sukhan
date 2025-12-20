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
import Poets from './pages/Poets';
import Search from './pages/Search'
import PoetProfile from './pages/PoetProfile';
import PoemDetail from './pages/PoemDetail';
import PrivateRoute from './pages/PrivateRoute';
import AdminRoutes from './pages/AdminRoutes';
import AdminDashboard from './pages/AdminDashboard';
import AdminPoets from './pages/AdminPoets';
import AdminPoems from './pages/AdminPoems';

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
            <Route path="/poems" element={<Poems />} />
            <Route path="/poets" element={<Poets />} />
            <Route path="/search" element={<Search />} />
            <Route path='/poets/:id' element={<PoetProfile />} />
            <Route path="/poems/:id" element={<PoemDetail />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            {/* Add other routes as you create them */}
            {/* <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/dictionary" element={<Dictionary />} /> */}
            <Route path="/admin" element={<AdminRoutes />}>
            <Route index element={<AdminDashboard />} />
            <Route path="poets" element={<AdminPoets />} />
            <Route path="poems" element={<AdminPoems />} />
            </Route>

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;