import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getProfile } from './redux/slices/authSlice';
// import Navbar from './components/layout/Navbar';
// import Footer from './components/layout/Footer';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Poems from './pages/Poems';
// import Poets from './pages/Poets';
// import Collections from './pages/Collections';
// import Dictionary from './pages/Dictionary';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is authenticated on app load
    dispatch(getProfile());
  }, [dispatch]);

  return (
    <>
      <div className="min-h-screen bg-base-100" data-theme="light">
        {/* <Navbar /> */}
        <main>
          <Routes>
            {/* <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/poems" element={<Poems />} />
            <Route path="/poets" element={<Poets />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/dictionary" element={<Dictionary />} /> */}
            {/* Add more routes as needed */}
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </>
  );
}

export default App;