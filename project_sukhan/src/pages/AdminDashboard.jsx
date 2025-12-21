import { useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';
import { useNavigate } from 'react-router';
import AdminShimmer from '../shimmer/AdminShimmer';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    adminService.dashboard().then(res => setStats(res.data));
  }, []);

  if (!stats) return <AdminShimmer />;

  return (
    <div className="min-h-screen bg-base-100 flex justify-center">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-10 py-10">

        <h1 className="text-3xl font-serif mb-12 text-center text-base-content">
          Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
          <StatCard label="Poets" value={stats.poets} />
          <StatCard label="Poems" value={stats.poems} />
          <StatCard label="Users" value={stats.users} />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ActionCard
            title="Manage Poets"
            desc="Create, edit or delete poets"
            onClick={() => navigate('/admin/poets')}
          />
          <ActionCard
            title="Manage Poems"
            desc="Create, edit or delete poems"
            onClick={() => navigate('/admin/poems')}
          />
        </div>

      </div>
    </div>
  );
};



const StatCard = ({ label, value, onClick }) => (
  <div
    onClick={onClick}
    className="
      cursor-pointer
      bg-base-200
      hover:bg-base-300
      border border-base-300/40
      shadow-lg
      rounded-2xl
      p-8
      text-center
      transition
    "
  >
    <h3 className="text-sm tracking-wide text-base-content/70">{label}</h3>
    <p className="text-4xl font-bold mt-3 text-base-content">{value}</p>
  </div>
);


const ActionCard = ({ title, desc, onClick }) => (
  <div
    onClick={onClick}
    className="
      cursor-pointer
      bg-base-200
      hover:bg-base-300
      border border-base-300/40
      shadow-lg
      rounded-2xl
      p-8
      transition
    "
  >
    <h2 className="text-xl font-semibold mb-2 text-base-content">{title}</h2>
    <p className="text-base-content/70">{desc}</p>
  </div>
);

export default AdminDashboard;
