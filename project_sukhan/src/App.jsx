import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { ThemeProvider } from './context/ThemeContext';
import AdminCollections from './pages/admin/AdminCollections';
import { loadUser } from './redux/slices/authSlice';
import LikedPoems from './pages/LikedPoems';
import SavedPoems from './pages/SavedPoems';
import CollectionForm from './components/admin/CollectionForm';
import CollectionDetail from './pages/CollectionDetail';
import ExploreBooks from './pages/ExploreBooks';
import AddBook from './pages/admin/AddBook';
import EditBook from './pages/admin/EditBook';
import AdminBooks from './pages/admin/AdminBooks';
import About from './pages/About';
import AdminPoetOwnershipRequests from './pages/admin/AdminPoetOwnershipRequests';
import ClaimPoetOwnership from './pages/poetOwner/ClaimPoetOwnership';
import AdminPoetOwners from './pages/admin/AdminPoetOwners';
import PoetOwnerRoute from './routes/PoetOwnerRoute';
import PoetOwnerDashboard from './pages/poetOwner/PoetOwnerDashboard';

function App() {
  const dispatch = useDispatch();
  const zenMode = useSelector(state => state.ui.zenMode);


  useEffect(() => {
    dispatch(loadUser());
  }, []);


  return (
    <Router>
      <ThemeProvider>
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
              <Route path='collections/:id' element={<CollectionDetail />} />
              <Route path='/poets/:id' element={<PoetProfile />} />
              <Route path="/poems/:id" element={<PoemDetail />} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/profile/likedPoems" element={<PrivateRoute><LikedPoems /></PrivateRoute>} />
              <Route path="/profile/savedPoems" element={<PrivateRoute><SavedPoems /></PrivateRoute>} />
              <Route path="/books/explore" element={<ExploreBooks/>} />
              <Route path="/about" element={<About />} />
              <Route path='/poet-ownership/claim/:poetId' element={<ClaimPoetOwnership />} />


              <Route path="/admin" element={<AdminRoutes />}>
                <Route index element={<AdminDashboard />} />
                <Route path="poets" element={<AdminPoets />} />
                <Route path="poems" element={<AdminPoems />} />
                <Route path="collections" element={<AdminCollections />} />
                <Route path="books" element={<AdminBooks />} />
                <Route path="books/add" element={<AddBook />} />
                <Route path="books/edit/:id" element={<EditBook />} />
                <Route path='poet-ownership/requests' element={<AdminPoetOwnershipRequests />} />
                <Route path='poet-owners' element={<AdminPoetOwners />} />
              </Route>

              <Route path='/poet-owner' element={<PoetOwnerRoute />}>
                <Route index element={<PoetOwnerDashboard />} />
              </Route>

            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;