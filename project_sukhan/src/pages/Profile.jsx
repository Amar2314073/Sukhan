import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import {
  logoutUser,
  deleteProfile,
  getProfile,
  updateProfile
} from '../redux/slices/authSlice';
import ProfileShimmer from '../shimmer/ProfileShimmer';
import UserForm from '../components/UserForm';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, isLoading } = useSelector(s => s.auth);

  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate('/login');
    if (!user) dispatch(getProfile());
  }, [dispatch, navigate, user]);

  if (isLoading || !user) return <ProfileShimmer />;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* ===== HEADER ===== */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-10 flex items-center gap-6">
          <div className="w-12 h-12 md:w-24 md:h-24 rounded-full bg-gray-800 flex items-center justify-center text-3xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-serif">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
            {user.bio && (
              <p className="mt-2 text-gray-300 max-w-xl">{user.bio}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ===== SIDEBAR ===== */}
          <aside className="lg:w-1/4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              {['overview', 'favorites', 'collections'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-2 rounded-lg mb-1 transition
                    ${activeTab === tab
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                  `}
                >
                  {tab === 'overview' && '📖 Overview'}
                  {tab === 'favorites' && '❤️ Favorites'}
                  {tab === 'collections' && '📚 Collections'}
                </button>
              ))}

              <div className="border-t border-gray-800 my-4" />

              <button
                onClick={() => setShowEditModal(true)}
                className="w-full px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800"
              >
                ✏️ Edit Profile
              </button>

              <button
                onClick={() => dispatch(logoutUser())}
                className="w-full px-4 py-2 rounded-lg text-red-400 hover:bg-gray-800"
              >
                🚪 Logout
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full px-4 py-2 rounded-lg text-red-500 hover:bg-gray-800"
              >
                🗑 Delete Account
              </button>
            </div>
          </aside>

          {/* ===== MAIN ===== */}
          <main className="lg:w-3/4">

            {activeTab === 'overview' && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
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
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                {user.likedPoems.length === 0
                  ? <p className="text-gray-400">No liked poems yet.</p>
                  : user.likedPoems.map(p => (
                      <Link
                        key={p._id}
                        to={`/poems/${p._id}`}
                        className="block border-b border-gray-800 py-3 hover:text-white"
                      >
                        <p className="italic line-clamp-2">
                          {p.content?.hindi || p.content?.roman}
                        </p>
                        <p className="text-sm text-gray-500">— {p.poet?.name}</p>
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

      {/* ===== DELETE MODAL ===== */}
      {showDeleteModal && (
        <ConfirmModal
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
      bg-gray-800
      rounded-xl
      p-6
      text-center
      cursor-pointer
      hover:bg-gray-700
      transition
    "
  >
    <div className="text-3xl font-semibold">{value}</div>
    <div className="text-gray-400 mt-1">{title}</div>
  </div>
);

const ConfirmModal = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-sm">
      <h3 className="text-lg text-red-400 font-semibold mb-3">Delete Account</h3>
      <p className="text-gray-400 mb-4">
        This action is permanent.
      </p>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2 bg-gray-800 rounded-lg">
          Cancel
        </button>
        <button onClick={onConfirm} className="px-4 py-2 bg-red-600 rounded-lg">
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default Profile;
