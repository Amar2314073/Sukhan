import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router";
import { useTheme } from '@/context/ThemeContext';
import {
  LogOut,
  Trash2,
  Moon,
  Heart,
  BookOpen,
  Library,
  Pencil,
  Info
} from "lucide-react";
import {
  logoutUser,
  deleteProfile,
  getProfile,
  updateProfile
} from "@/redux/slices/authSlice";
import ConfirmModal from "@/components/ConfirmModal";
import ProfileShimmer from "@/shimmer/ProfileShimmer";
import UserForm from "@/components/UserForm";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useSelector(s => s.auth);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isAuthenticated && !user) {
      dispatch(getProfile());
    }
  }, [dispatch, navigate, isAuthenticated, isLoading, user]);


  const confirmLogout = async () => {
    setLoggingOut(true);
    await dispatch(logoutUser()).unwrap();
    setLoggingOut(false);
    navigate("/");
  };

  if (isLoading || !user) return <ProfileShimmer />

  return (
    <div className="min-h-screen bg-base-100 px-4 py-6">

      {/* ===== USER CARD ===== */}
      <div className="bg-base-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-base-300 flex items-center justify-center text-xl font-bold">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-base-content/60">{user.email}</p>
          </div>
        </div>
      </div>

      {/* ===== MY ACTIVITY ===== */}
      <div className="bg-base-200 rounded-2xl p-5 mb-6">
        <h3 className="font-semibold mb-4">My Activity</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <Stat
            icon={<Heart size={18} />}
            value={user.likedPoems?.length || 0}
            label="Liked"
            onClick={() => navigate("/profile/likedPoems")}
          />
          <Stat
            icon={<BookOpen size={18} />}
            value={user.savedPoems?.length || 0}
            label="Saved"
            onClick={() => navigate("/profile/savedPoems")}
          />
          <Stat
            icon={<Library size={18} />}
            value={user.collections?.length || 0}
            label="Collections"
          />
        </div>
      </div>

      {/* ===== SETTINGS ===== */}
      <div className="bg-base-200 rounded-2xl divide-y divide-base-300 mb-6">

        <RowItem
          icon={<Pencil size={18} />}
          label="Edit Profile"
          onClick={() => setShowEditModal(true)}
        />

        <RowItem
          icon={<Moon size={18} />}
          label="Dark Mode"
          right={
            <input
              type="checkbox"
              className="toggle"
              checked={isDark}
              onChange={toggleTheme}
            />
          }
        />

        <RowItem
          icon={<Info size={18} />}
          label="About Us"
          onClick={() => navigate("/about")}
        />


        <RowItem
          icon={<LogOut size={18} />}
          label="Logout"
          onClick={() => setShowLogoutModal(true)}
        />

        <RowItem
          icon={<Trash2 size={18} />}
          label="Delete Account"
          onClick={() => setShowDeleteModal(true)}
          danger
        />
      </div>

      {/* ===== MODALS ===== */}
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

      {showDeleteModal && (
        <ConfirmModal
          title="Delete Account"
          message="This action is permanent."
          confirmText="Delete"
          variant="error"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            dispatch(deleteProfile());
            navigate("/");
          }}
        />
      )}

    </div>
  );
};

const Stat = ({ icon, value, label, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-base-300/40 rounded-xl p-4 hover:bg-base-300 transition"
  >
    <div className="flex justify-center mb-2 text-base-content/70">
      {icon}
    </div>
    <div className="text-lg font-semibold">{value}</div>
    <div className="text-xs text-base-content/60">{label}</div>
  </div>
);

const RowItem = ({ icon, label, right, onClick, danger }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between px-5 py-4 transition cursor-pointer
      ${danger ? "text-error hover:bg-error/10" : "hover:bg-base-300/40"}
    `}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {right}
  </div>
);

export default Profile;
