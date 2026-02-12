import { useState } from "react";
import { poetOwnerService } from "@/services/poetOwner.service";
import toast from "react-hot-toast";

const PoetOwnerPoetForm = ({ poet, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: poet?.name || "",
    bio: poet?.bio || "",
    era: poet?.era || "Contemporary",
    birthYear: poet?.birthYear || "",
    deathYear: poet?.deathYear || "",
    country: poet?.country || "",
    image: poet?.image || ""
  });

  const submit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Updating poet profile...");

    try {
      const res = await poetOwnerService.updatePoetProfile(
        poet._id,
        form
      );
      toast.success("Poet profile updated successfully!", { id: toastId });
      onSuccess(res.data.poet);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-xl flex flex-col">

        {/* ================= HEADER ================= */}
        <div className="px-6 py-4 border-b border-base-300/40 flex justify-between items-center">
          <h2 className="text-xl font-serif font-semibold">
            Edit Poet Profile
          </h2>
          <button
            onClick={onClose}
            className="text-base-content/60 hover:text-error"
          >
            ✕
          </button>
        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={submit} className="flex flex-col flex-1">

          {/* ===== SCROLLABLE BODY ===== */}
          <div className="p-6 space-y-4 overflow-y-auto max-h-[65vh]">

            {/* Name */}
            <div>
              <label className="text-sm text-base-content/70">Name *</label>
              <input
                required
                value={form.name}
                onChange={e =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
                placeholder="Poet name"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm text-base-content/70">Bio *</label>
              <textarea
                required
                rows={4}
                value={form.bio}
                onChange={e =>
                  setForm({ ...form, bio: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
                placeholder="Short biography"
              />
            </div>

            {/* Era */}
            <div>
              <label className="text-sm text-base-content/70">Era *</label>
              <select
                value={form.era}
                onChange={e =>
                  setForm({ ...form, era: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
              >
                <option value="Classical">Classical</option>
                <option value="Modern">Modern</option>
                <option value="Contemporary">Contemporary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Birth  and Death Year + Country */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                    placeholder="Birth year"
                    value={form.birthYear}
                    onChange={e =>
                    setForm({ ...form, birthYear: e.target.value })
                    }
                    className="px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
                />

                <input
                    placeholder="Death year (optional)"
                    value={form.deathYear}
                    onChange={e =>
                    setForm({ ...form, deathYear: e.target.value })
                    }
                    className="px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
                />

                <input
                    required
                    placeholder="Country"
                    value={form.country}
                    onChange={e =>
                    setForm({ ...form, country: e.target.value })
                    }
                    className="px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
                />
                </div>


            {/* Image */}
            <div>
              <label className="text-sm text-base-content/70">Image URL</label>
              <input
                value={form.image}
                onChange={e =>
                  setForm({ ...form, image: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
                placeholder="https://image-url"
              />
            </div>

            {/* Image Preview */}
            {form.image && (
              <div className="flex items-center gap-4 mt-2">
                <img
                  src={form.image}
                  alt="Image Preview"
                  className="w-16 h-16 rounded-full object-cover border border-base-300"
                  onError={(e) => {
                    e.target.src = "";
                  }}
                />
                <p className="text-sm text-base-content/60">
                  Preview
                </p>
              </div>
            )}

          </div>

          {/* ===== FIXED FOOTER ===== */}
          <div className="px-6 py-4 border-t border-base-300/40 flex justify-end gap-4 bg-base-100 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-base-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary text-primary-content"
            >
              Update
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PoetOwnerPoetForm;
