import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/slices/authSlice';
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
import PrivateRoute from './routes/PrivateRoute';
import AdminRoutes from './routes/AdminRoutes';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPoets from './pages/admin/AdminPoets';
import AdminPoems from './pages/admin/AdminPoems';
import { Toaster } from 'react-hot-toast';
import Collections from './pages/Collections';

function App() {
  const dispatch = useDispatch();
  const zenMode = useSelector(state => state.ui.zenMode);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <Toaster position="bottom-center" />
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <main
          className={`
            transition-all duration-900
            ${zenMode ? 'pt-0' : 'pt-1'}
          `}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/poems" element={<Poems />} />
            <Route path="/poets" element={<Poets />} />
            <Route path="/search" element={<Search />} />
            <Route path="/collections" element={<Collections />} />
            <Route path='/poets/:id' element={<PoetProfile />} />
            <Route path="/poems/:id" element={<PoemDetail />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            {/* <Route path="/dictionary" element={<Dictionary />} /> */}
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