import { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";
import AdminShimmer from "../../shimmer/AdminShimmer";

const AdminPoetOwnershipRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPoetOwnershipRequests();
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Failed to fetch ownership requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await adminService.approvePoetOwnership(id);
      await fetchRequests();
    } catch (err) {
      console.error("Approve failed", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(id);
      await adminService.rejectPoetOwnership(id);
      await fetchRequests();
    } catch (err) {
      console.error("Reject failed", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <AdminShimmer />;

  return (
    <div className="min-h-screen bg-base-100 flex justify-center">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-10 py-10">

        <h1 className="text-3xl font-serif mb-10 text-center text-base-content">
          Poet Ownership Requests
        </h1>

        {requests.length === 0 ? (
          <div className="text-center text-base-content/60 bg-base-200 rounded-2xl p-10 border border-base-300">
            No pending ownership requests
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="
                  bg-base-200
                  border border-base-300/40
                  rounded-2xl
                  shadow-lg
                  p-6
                  flex flex-col md:flex-row
                  md:items-center
                  md:justify-between
                  gap-6
                "
              >
                {/* Info */}
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-base-content">
                    {req.poet?.name}
                  </p>
                  <p className="text-sm text-base-content/70">
                    Claimant: <span className="font-medium">{req.user?.name}</span>
                  </p>
                  <p className="text-sm text-base-content/60">
                    {req.user?.email}
                  </p>
                  <p className="text-xs text-base-content/40">
                    Requested on {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    disabled={actionLoading === req._id}
                    onClick={() => handleApprove(req._id)}
                    className="
                      btn
                      bg-success
                      text-success-content
                      hover:bg-success/80
                      rounded-xl
                      px-6
                    "
                  >
                    {actionLoading === req._id ? "Approving..." : "Approve"}
                  </button>

                  <button
                    disabled={actionLoading === req._id}
                    onClick={() => handleReject(req._id)}
                    className="
                      btn
                      bg-error
                      text-error-content
                      hover:bg-error/80
                      rounded-xl
                      px-6
                    "
                  >
                    {actionLoading === req._id ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPoetOwnershipRequests;
