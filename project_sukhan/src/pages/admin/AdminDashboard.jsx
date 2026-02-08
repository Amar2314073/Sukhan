import { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import { useNavigate } from 'react-router';
import AdminShimmer from '../../shimmer/AdminShimmer';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [syncing, setSyncing] = useState(false);



  useEffect(() => {
    adminService.dashboard().then(res => setStats(res.data));
  }, []);

  const handleSync = async () => {
    try {
      setSyncing(true);
      const res = await adminService.syncStats();
      setStats(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setSyncing(false);
      setShowConfirm(false);
    }
  };

    const cardsData = [
    {
      title: 'Manage Poets',
      desc: "Create, edit or delete poets",
      count: stats?.poets,
      onClick: () => navigate('/admin/poets')
    },
    {
      title: "Manage Poems",
      desc: "Create, edit or delete poems",
      count: stats?.poems,
      onClick: () => navigate('/admin/poems')
    },
    {
      title: "Manage Collections",
      desc: "Create, edit or delete collections",
      count: stats?.collections,
      onClick: () => navigate('/admin/collections')
    },
    {
      title: "Manage Books",
      desc: "Create, edit or delete Books",
      count: stats?.books,
      onClick: () => navigate('/admin/books')
    },
    {
      title: "Manage Poet Owners",
      desc: "Manage the list of owners",
      count: stats?.poetOwners,
      onClick: () => navigate('/admin/poet-owners')
    },
    {
      title: "Manage Poet Ownership Requests",
      desc: "Verify and approve poet claims",
      count: stats?.pendingOwnershipRequests,
      onClick: () => navigate("/admin/poet-ownership/requests")
    }
  ]


  if (!stats) return <AdminShimmer />;

  return (
    <div className="min-h-screen bg-base-100 flex justify-center">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-10 py-10">

        <h1 className="text-3xl font-serif mb-12 text-center text-base-content">
          Admin Dashboard
        </h1>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cardsData.map(d => (
            <ActionCard
            title = {d.title}
            desc = {d.desc}
            count = {d.count}
            onClick = {d.onClick}
            />
          ))}
        </div>
        {/* Sync Stat Button */}
        <div className="flex justify-center mt-14">
          <button
            onClick={() => setShowConfirm(true)}
            className="btn btn-outline btn-ghost px-8"
          >
            Sync Stats
          </button>
        </div>

      </div>
      {showConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Sync Dashboard Stats?</h3>

            <p className="py-4 text-base-content/70">
              This will re-calculate all admin statistics.
              Are you sure you want to continue?
            </p>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowConfirm(false)}
                disabled={syncing}
              >
                Cancel
              </button>

              <button
                className="btn bg-base-200 btn-outline"
                onClick={handleSync}
                disabled={syncing}
              >
                {syncing ? "Syncing..." : "Yes, Sync"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const StatBadge = ({ value, intent = "neutral" }) => {
  const styles = {
    neutral: "bg-base-300 text-base-content/80",
    primary: "bg-primary/15 text-primary",
    warning: "bg-warning/20 text-warning",
    danger: "bg-error/20 text-error"
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        px-5 py-1
        text-sm font-semibold
        rounded-xl
        tracking-wide
        border border-base-300/60
        ${styles[intent]}
      `}
    >
      {value}
    </span>
  );
};


const ActionCard = ({ title, desc, count, onClick }) => (
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
    <div className='flex items-center justify-between mb-2'>
      <h2 className="text-xl font-semibold text-base-content">{title}</h2>
      <StatBadge value={count} intent='primary' />
    </div>
    <p className="text-base-content/70">{desc}</p>
  </div>
);

export default AdminDashboard;




