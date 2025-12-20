import { useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';
import { useNavigate } from 'react-router';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    adminService.dashboard().then(res => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <>
      <h1 className="text-3xl font-serif mb-8 text-center mt-2">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard label="Poets" value={stats.poets} onClick={() => navigate('/admin/poets')} />
        <StatCard label="Poems" value={stats.poems} onClick={() => navigate('/admin/poems')} />
        <StatCard label="Users" value={stats.users} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </>
  );
};

const StatCard = ({ label, value, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-blue-400 hover:bg-gray-700 p-6 rounded-xl shadow mx-auto text-center text-white w-100"
  >
    <h3 className="text-lg">{label}</h3>
    <p className="text-4xl font-bold">{value}</p>
  </div>
);

const ActionCard = ({ title, desc, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-base-50 p-6 rounded-xl shadow hover:shadow-lg"
  >
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default AdminDashboard;
