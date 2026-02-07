import { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";
import AdminPoemsShimmer from "../../shimmer/AdminPoemsShimmer";
import { toast } from "react-hot-toast";
import ConfirmDelete from "../../components/ConfirmDelete";

const AdminPoetOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);
  const [confirmPoet, setConfirmPoet] = useState(null);

  /* ================= FETCH ================= */
  const fetchOwners = async () => {
    try {
      const res = await adminService.getAllPoetOwners();
      setOwners(res.data.poets || []);
    } catch (err) {
      toast.error("Failed to load poet owners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  /* ================= CONFIRM FLOW ================= */
  const openRevokeConfirm = (poet) => {
    setConfirmPoet(poet);
  };

  const confirmRevokeOwner = async () => {
    if (!confirmPoet) return;

    try {
      setRevokingId(confirmPoet._id);

      await adminService.revokePoetOwner(confirmPoet._id);

      toast.success("Poet owner revoked successfully");
      setConfirmPoet(null);
      fetchOwners();

    } catch (err) {
      toast.error(err.response?.data?.message || "Revoke failed");
    } finally {
      setRevokingId(null);
    }
  };

  if (loading) return <AdminPoemsShimmer />;

  return (
    <div className="min-h-screen bg-base-100 px-6 py-10">
      <h1 className="text-3xl font-serif text-base-content mb-8">
        Poet Owners
      </h1>

      {owners.length === 0 ? (
        <p className="text-base-content/60">
          No verified poet owners found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full bg-base-200 rounded-xl">
            <thead>
              <tr className="text-base-content/70">
                <th>Poet</th>
                <th>Owner</th>
                <th>Email</th>
                <th>Assigned At</th>
                <th>Verified By</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {owners.map((p) => (
                <tr key={p._id}>
                  <td className="font-medium">{p.name}</td>

                  <td>{p.owner?.name || "—"}</td>

                  <td className="text-sm text-base-content/70">
                    {p.owner?.email || "—"}
                  </td>

                  <td className="text-sm">
                    {p.ownerAssignedAt
                      ? new Date(p.ownerAssignedAt).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="text-sm text-base-content/70">
                    {p.ownerVerifiedBy?.name || "—"}
                  </td>

                  <td>
                    <button
                      onClick={() => openRevokeConfirm(p)}
                      disabled={revokingId === p._id}
                      className="
                        btn btn-sm btn-error btn-outline
                        rounded-full
                        disabled:opacity-60
                      "
                    >
                      {revokingId === p._id ? "Revoking..." : "Revoke"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= CONFIRM MODAL ================= */}
      {confirmPoet && (
        <ConfirmDelete
          title={`Delete ownership of "${confirmPoet.name}"?`}
          onCancel={() => setConfirmPoet(null)}
          onConfirm={confirmRevokeOwner}
        />
      )}
    </div>
  );
};

export default AdminPoetOwners;
