import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import { updateProfile, deleteProfile, logoutUser, getProfile } from '../redux/slices/authSlice';
import ProfileShimmer from '../shimmer/ProfileShimmer';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, isLoading } = useSelector(state => state.auth);
    console.log('AUTH STATE:', {
    user,
    isAuthenticated,
    isLoading,
    token: localStorage.getItem('token')
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/login');
    }
    if (!user) {
      dispatch(getProfile());
    }
  }, [dispatch, navigate, user]);

  if (isLoading) return <ProfileShimmer/>;

  /* ---------------- HANDLERS ---------------- */
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteProfile()).unwrap();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* ---------- HEADER ---------- */}
        <div className="bg-base-200 rounded-2xl p-8 mb-10">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-600 to-amber-700
            text-white flex items-center justify-center text-4xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-serif font-bold text-amber-900">
                {user.name}
              </h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
              <p className="mt-3 text-gray-700 max-w-xl">
                {user.bio || 'Poetry lover exploring words and meanings.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ---------- SIDEBAR ---------- */}
          <aside className="lg:w-1/4">
            <div className="bg-base-200 rounded-2xl p-6 sticky top-8">
              <ul className="menu space-y-1">

                <li>
                  <button onClick={() => setActiveTab('overview')}
                    className={activeTab === 'overview' ? 'active font-semibold' : ''}>
                    📖 Overview
                  </button>
                </li>

                <li>
                  <button onClick={() => setActiveTab('favorites')}
                    className={activeTab === 'favorites' ? 'active font-semibold' : ''}>
                    ❤️ Favorites
                  </button>
                </li>

                <li>
                  <button onClick={() => setActiveTab('collections')}
                    className={activeTab === 'collections' ? 'active font-semibold' : ''}>
                    📚 Collections
                  </button>
                </li>

                <li>
                  <button onClick={() => setActiveTab('edit')}
                    className={activeTab === 'edit' ? 'active font-semibold' : ''}>
                    ✏️ Edit Profile
                  </button>
                </li>

                <li className="divider" />

                <li>
                  <button onClick={handleLogout} className="text-red-600">
                    🚪 Logout
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-red-600">
                    🗑 Delete Account
                  </button>
                </li>

              </ul>
            </div>
          </aside>

          {/* ---------- MAIN CONTENT ---------- */}
          <main className="lg:w-3/4">

            {/* ===== OVERVIEW ===== */}
            {activeTab === 'overview' && (
              <div className="bg-base-200 rounded-2xl p-8">
                <h2 className="text-2xl font-serif mb-6">
                  My Poetry Space
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">

                  <div
                    className="cursor-pointer bg-base-100 rounded-xl p-6 text-center
                    hover:bg-amber-50"
                    onClick={() => setActiveTab('favorites')}
                  >
                    <div className="text-3xl font-bold text-amber-700">
                      {user.stats?.favoritesCount || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Liked Poems
                    </div>
                  </div>

                  <div
                    className="cursor-pointer bg-base-100 rounded-xl p-6 text-center
                    hover:bg-amber-50"
                    onClick={() => setActiveTab('collections')}
                  >
                    <div className="text-3xl font-bold text-amber-700">
                      {user.stats?.collectionsCreated || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Collections
                    </div>
                  </div>

                  <div className="bg-base-100 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-amber-700">
                      {user.savedPoems?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Saved Poems
                    </div>
                  </div>

                </div>

                <button
                  onClick={() => setActiveTab('edit')}
                  className="btn btn-outline btn-primary"
                >
                  Edit Profile
                </button>
              </div>
            )}

            {/* ===== FAVORITES ===== */}
            {activeTab === 'favorites' && (
              <div className="bg-base-200 rounded-2xl p-8">
                <h2 className="text-2xl font-serif mb-6">
                  My Favorites
                </h2>

                {(!user.likedPoems || user.likedPoems.length === 0) ? (
                  <p className="text-gray-600">No favorite poems yet.</p>
                ) : (
                  <div className="space-y-4">
                    {user.likedPoems.map(poem => (
                      <Link
                        key={poem._id}
                        to={`/poems/${poem._id}`}
                        className="block border-b pb-3 hover:text-amber-700"
                      >
                        <p className="italic line-clamp-2">
                          {poem.content?.hindi || poem.content?.roman}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          — {poem.poet?.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===== COLLECTIONS ===== */}
            {activeTab === 'collections' && (
              <div className="bg-base-200 rounded-2xl p-8">
                <h2 className="text-2xl font-serif mb-6">
                  My Collections
                </h2>
                <p className="text-gray-600">
                  Collections feature coming soon.
                </p>
              </div>
            )}

            {/* ===== EDIT PROFILE ===== */}
            {activeTab === 'edit' && (
              <div className="bg-base-200 rounded-2xl p-8">
                <h2 className="text-2xl font-serif mb-6">
                  Edit Profile
                </h2>

                <form
                  onSubmit={e => {
                    e.preventDefault();
                    dispatch(updateProfile({
                      name: e.target.name.value,
                      bio: e.target.bio.value
                    }));
                  }}
                  className="space-y-6"
                >
                  <input
                    name="name"
                    defaultValue={user.name}
                    className="input input-bordered w-full"
                    placeholder="Your name"
                  />

                  <textarea
                    name="bio"
                    defaultValue={user.bio}
                    className="textarea textarea-bordered w-full"
                    placeholder="About you"
                  />

                  <button
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ---------- DELETE MODAL ---------- */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-red-600">
              Delete Account
            </h3>
            <p className="py-4">
              This action is permanent. Are you sure?
            </p>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleDeleteAccount}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
