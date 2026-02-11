import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import { Pencil, LogOut, Trash2, BookOpen, Heart, Library } from "lucide-react";
import {
  logoutUser,
  deleteProfile,
  getProfile,
  updateProfile
} from '../redux/slices/authSlice';
import ProfileShimmer from '../shimmer/ProfileShimmer';
import UserForm from '../components/UserForm';
import ConfirmModal from '../components/ConfirmModal';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, isLoading } = useSelector(s => s.auth);

  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);


  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isAuthenticated && !user) {
      dispatch(getProfile());
    }
  }, [dispatch, navigate, isAuthenticated, isLoading, user]);

  const confirmLogout = async () => {
    try {
      setLoggingOut(true);
      await dispatch(logoutUser()).unwrap();
      navigate('/');
    } finally {
      setLoggingOut(false);
      setShowLogoutModal(false);
    }
  };



  if (isLoading || !user) return <ProfileShimmer />;

  return (
    <div className="min-h-screen bg-base-100 text-base-content py-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* ===== HEADER ===== */}
        <div className="bg-base-200 border border-base-300/40 rounded-2xl p-8 mb-10 flex items-center gap-6">
          <div className="w-12 h-12 md:w-24 md:h-24 rounded-full bg-base-300/40 flex items-center justify-center text-3xl font-bold">
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-3xl font-serif">{user.name}</h1>
            <p className="text-base-content/60">{user.email}</p>
            {user.bio && (
              <p className="mt-2 text-base-content/80 max-w-xl">{user.bio}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ===== SIDEBAR ===== */}
          <aside className="lg:w-1/4">
            <div className="bg-base-200 border border-base-300/40 rounded-2xl p-6">
              {['overview', 'favorites', 'collections'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center gap-2 text-left px-4 py-2 rounded-lg mb-1 transition
                    ${activeTab === tab
                      ? 'bg-base-300/40 text-base-content/90'
                      : 'text-base-content/60 hover:bg-base-300 hover:text-base-content/80'}
                  `}
                >
                  {tab === 'overview' && (
                    <>
                      <BookOpen size={16} />
                      <span>Overview</span>
                    </>
                  )}
                  {tab === 'favorites' && (
                    <>
                      <Heart size={16} />
                      <span>favourites</span>
                    </>
                  )}
                  {tab === 'collections' && (
                    <>
                      <Library size={16} />
                      <span>Collections</span>
                    </>
                  )}
                </button>
              ))}

              <div className="border-t border-base-300/40 my-4" />

              <button
                onClick={() => setShowEditModal(true)}
                className="w-full px-4 py-2 rounded-lg flex items-center gap-2 text-base-content/80 hover:bg-base-300 transition"
              >
                <Pencil size={16} />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full px-4 py-2 rounded-lg flex items-center gap-2 text-error hover:bg-error/10 transition"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full px-4 py-2 rounded-lg flex items-center gap-2 text-error hover:bg-error/10 transition"
              >
                <Trash2 size={16} />
                <span>Delete Account</span>
              </button>
            </div>
          </aside>

          {/* ===== MAIN ===== */}
          <main className="lg:w-3/4">

            {activeTab === 'overview' && (
              <div className="bg-base-200 border border-base-300/40 rounded-2xl p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <Stat 
                    onClick = {()=>navigate('/profile/likedPoems')} 
                    title="Liked Poems" 
                    value={user.likedPoems?.length || 0} 
                  />
                  <Stat
                    onClick = {()=>navigate('/profile/savedPoems')} 
                    title="Saved Poems" 
                    value={user.savedPoems?.length || 0} />
                  <Stat title="Collections" value={user.collections?.length || 0} />                  
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-base-200 border border-base-300/40 rounded-2xl p-8">
                {user.likedPoems.length === 0
                  ? <p className="text-base-content/60">No liked poems yet.</p>
                  : user.likedPoems.map(p => (
                      <Link
                        key={p._id}
                        to={`/poems/${p._id}`}
                        className="block border-b border-base-300/40 py-3 hover:text-primary transition"
                      >
                        <p className="italic line-clamp-2">
                          {p.content?.hindi || p.content?.roman}
                        </p>
                        <p className="text-sm text-base-content/50">— {p.poet?.name}</p>
                      </Link>
                    ))
                }
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {showEditModal && (
        <UserForm
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={(data) => {
            dispatch(updateProfile(data));
            setShowEditModal(false);
          }}
        />
      )}

      {/* ===== LOGOUT MODAL ===== */}
      {showLogoutModal && (
        <ConfirmModal
          title="Logout?"
          message="Are you sure you want to logout?"
          confirmText="Logout"
          variant="error"
          loading={loggingOut}
          disableCancel={loggingOut}
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={confirmLogout}
        />
      )}


      {/* ===== DELETE MODAL ===== */}
      {showDeleteModal && (
        <ConfirmModal
          title="Delete Account"
          message="This action is permanent. Are you sure you want to delete your account?"
          confirmText="Delete"
          variant="error"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            dispatch(deleteProfile());
            navigate('/');
          }}
        />
      )}

    </div>
  );
};

const Stat = ({ title, value, onClick }) => (
  <div
    onClick={onClick}
    className="
      bg-base-300/40
      rounded-xl
      p-6
      text-center
      cursor-pointer
      hover:bg-base-300
      transition
    "
  >
    <div className="text-3xl font-semibold">{value}</div>
    <div className="text-base-content/60 mt-1">{title}</div>
  </div>
);


export default Profile;
