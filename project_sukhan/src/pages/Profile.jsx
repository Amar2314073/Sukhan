import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateProfile, deleteProfile, logoutUser, getProfile } from '../redux/slices/authSlice';

// Validation schemas
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  preferredLanguage: z.enum(['english', 'hindi', 'urdu'])
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stats, setStats] = useState({
    poemsAdded: 0,
    collectionsCreated: 0,
    favorites: 0,
    contributions: 0
  });
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const { user, isLoading, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      preferredLanguage: user?.preferredLanguage || 'english'
    }
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema)
  });

  useEffect(() => {
    const checkAuth = async () => {
      // If no token, user is definitely not authenticated
      if (!localStorage.getItem('token')) {
        setIsCheckingAuth(false);
        navigate('/');
        return;
      }

      // If user data is already available, we're done
      if (user) {
        setIsCheckingAuth(false);
        return;
      }

      // If no user data but we have token, try to get profile
      try {
        await dispatch(getProfile()).unwrap();
      } catch (error) {
        // If getProfile fails, redirect to home
        console.log('Auth check failed:', error);
        navigate('/');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [dispatch, navigate, user]);

  useEffect(() => {
    if (user) {
      // Set form values when user data is available
      profileForm.reset({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        preferredLanguage: user.preferredLanguage || 'english'
      });

      // Mock user stats - replace with actual API calls
      setStats({
        poemsAdded: 12,
        collectionsCreated: 3,
        favorites: 47,
        contributions: 8
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (data) => {
    try {
      await dispatch(updateProfile(data)).unwrap();
      // Show success message
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      // Handle password change - you'll need to add this to your authSlice
      console.log('Password change data:', data);
      // await dispatch(changePassword(data)).unwrap();
      passwordForm.reset();
    } catch (error) {
      console.error('Password change error:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteProfile()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Account deletion error:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // If not authenticated after checking, don't render the profile
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="bg-base-200 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="avatar">
              <div className="w-24 h-24 rounded-full bg-primary text-primary-content text-4xl font-bold flex items-center justify-center">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-primary mb-2">{user.name}</h1>
              <p className="text-lg text-base-content/70 mb-4">{user.email}</p>
              <p className="text-base-content/60 max-w-2xl">
                {user.bio || "Welcome to your poetic journey. Share your thoughts and explore beautiful verses."}
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className="btn btn-outline btn-primary"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-figure text-primary">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <div className="stat-title">Poems Added</div>
            <div className="stat-value text-primary">{stats.poemsAdded}</div>
          </div>
          
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-figure text-secondary">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
              </svg>
            </div>
            <div className="stat-title">Collections</div>
            <div className="stat-value text-secondary">{stats.collectionsCreated}</div>
          </div>
          
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-figure text-accent">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div className="stat-title">Favorites</div>
            <div className="stat-value text-accent">{stats.favorites}</div>
          </div>
          
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-figure text-info">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
            </div>
            <div className="stat-title">Contributions</div>
            <div className="stat-value text-info">{stats.contributions}</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-base-200 rounded-2xl p-6 sticky top-8">
              <ul className="menu menu-lg space-y-2">
                <li>
                  <button 
                    className={`flex items-center gap-3 ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Information
                  </button>
                </li>
                <li>
                  <button 
                    className={`flex items-center gap-3 ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => setActiveTab('password')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Change Password
                  </button>
                </li>
                <li>
                  <button 
                    className={`flex items-center gap-3 ${activeTab === 'collections' ? 'active' : ''}`}
                    onClick={() => setActiveTab('collections')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    My Collections
                  </button>
                </li>
                <li>
                  <button 
                    className={`flex items-center gap-3 ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Favorites
                  </button>
                </li>
                <li className="divider my-2"></li>
                <li>
                  <button 
                    className="flex items-center gap-3 text-error"
                    onClick={handleLogout}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </li>
                <li>
                  <button 
                    className="flex items-center gap-3 text-error"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Account
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="bg-base-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">Profile Information</h2>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Full Name</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        {...profileForm.register('name')}
                      />
                      {profileForm.formState.errors.name && (
                        <span className="text-error text-sm mt-1">
                          {profileForm.formState.errors.name.message}
                        </span>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Email Address</span>
                      </label>
                      <input
                        type="email"
                        className="input input-bordered"
                        {...profileForm.register('email')}
                      />
                      {profileForm.formState.errors.email && (
                        <span className="text-error text-sm mt-1">
                          {profileForm.formState.errors.email.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Bio</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-24"
                      placeholder="Tell us about yourself and your love for poetry..."
                      {...profileForm.register('bio')}
                    />
                    {profileForm.formState.errors.bio && (
                      <span className="text-error text-sm mt-1">
                        {profileForm.formState.errors.bio.message}
                      </span>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Preferred Language</span>
                    </label>
                    <select
                      className="select select-bordered"
                      {...profileForm.register('preferredLanguage')}
                    >
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                      <option value="urdu">Urdu</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => profileForm.reset()}
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <div className="bg-base-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">Change Password</h2>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Current Password</span>
                    </label>
                    <input
                      type="password"
                      className="input input-bordered"
                      {...passwordForm.register('currentPassword')}
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <span className="text-error text-sm mt-1">
                        {passwordForm.formState.errors.currentPassword.message}
                      </span>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">New Password</span>
                    </label>
                    <input
                      type="password"
                      className="input input-bordered"
                      {...passwordForm.register('newPassword')}
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <span className="text-error text-sm mt-1">
                        {passwordForm.formState.errors.newPassword.message}
                      </span>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Confirm New Password</span>
                    </label>
                    <input
                      type="password"
                      className="input input-bordered"
                      {...passwordForm.register('confirmPassword')}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <span className="text-error text-sm mt-1">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Collections Tab */}
            {activeTab === 'collections' && (
              <div className="bg-base-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">My Collections</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Sample Collections - Replace with actual data */}
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h3 className="card-title">Romantic Ghazals</h3>
                      <p className="text-base-content/60">12 poems</p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-ghost btn-sm">View</button>
                      </div>
                    </div>
                  </div>
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h3 className="card-title">Nature Poems</h3>
                      <p className="text-base-content/60">8 poems</p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-ghost btn-sm">View</button>
                      </div>
                    </div>
                  </div>
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h3 className="card-title">Freedom Verses</h3>
                      <p className="text-base-content/60">5 poems</p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-ghost btn-sm">View</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-8">
                  <button className="btn btn-outline btn-primary">
                    Create New Collection
                  </button>
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="bg-base-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">My Favorites</h2>
                <div className="space-y-4">
                  {/* Sample Favorites - Replace with actual data */}
                  <div className="card bg-base-100 shadow">
                    <div className="card-body">
                      <h3 className="card-title">"Dil-e-Nadaan" by Mirza Ghalib</h3>
                      <p className="text-base-content/60">Ghazal • Urdu</p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-ghost btn-sm">Read</button>
                      </div>
                    </div>
                  </div>
                  <div className="card bg-base-100 shadow">
                    <div className="card-body">
                      <h3 className="card-title">"Madhushala" by Harivansh Rai Bachchan</h3>
                      <p className="text-base-content/60">Poem • Hindi</p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-ghost btn-sm">Read</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Delete Account</h3>
            <p className="py-4">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;