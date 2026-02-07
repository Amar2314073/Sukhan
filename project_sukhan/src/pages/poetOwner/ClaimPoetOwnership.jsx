import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { poetOwnerService } from "../../services/poetOwner.service";
import toast from "react-hot-toast";

const ClaimPoetOwnership = () => {
  const { poetId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    claimantName: "",
    claimantEmail: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await poetOwnerService.submitClaim({poetId, ...form})
      toast.success("Ownership claim submitted. Admin will review it.");

      setSuccess(true);
      setTimeout(() => navigate(`/poets/${poetId}`), 1500);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to submit claim"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex justify-center items-center px-4">
      <div className="w-full max-w-lg bg-base-200 border border-base-300 rounded-2xl shadow-xl p-8">

        <h1 className="text-2xl font-serif text-center text-base-content mb-2">
          Claim Poet Profile
        </h1>

        <p className="text-sm text-center text-base-content/70 mb-8">
          Verify that you are the rightful owner or legal representative of this poet.
        </p>

        {success ? (
          <div className="text-center text-success font-medium">
            Claim submitted successfully.  
            <br />
            Admin will review it shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="label">
                <span className="label-text text-base-content/80">
                  Your Full Name
                </span>
              </label>
              <input
                type="text"
                name="claimantName"
                required
                value={form.claimantName}
                onChange={handleChange}
                className="input input-bordered w-full bg-base-100"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-base-content/80">
                  Your Email Address
                </span>
              </label>
              <input
                type="email"
                name="claimantEmail"
                required
                value={form.claimantEmail}
                onChange={handleChange}
                className="input input-bordered w-full bg-base-100"
              />
            </div>

            {error && (
              <p className="text-sm text-error text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full rounded-full"
            >
              {loading ? "Submitting..." : "Submit Claim"}
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default ClaimPoetOwnership;
