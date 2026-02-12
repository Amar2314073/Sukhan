import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "@/redux/slices/categorySlice";
import { poetOwnerService } from "@/services/poetOwner.service";
import toast from "react-hot-toast";

const PoetOwnerPoemForm = ({ poem, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.categories);
  const [submitting, setSubmitting] = useState(false);


  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    title: poem?.title || "",
    category: poem?.category?._id || poem?.category || "",
    content: {
      hindi: poem?.content?.hindi || "",
      roman: poem?.content?.roman || ""
    }
  });

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();

    if(submitting) return;
    setSubmitting(true);

    const toastId = toast.loading(
      poem ? "Updating poem..." : "Creating poem..."
    );

    try {
      let res;
      if (poem) {
        res = await poetOwnerService.updatePoem(poem._id, form);
        toast.success("Poem updated successfully", { id: toastId });
      } else {
        res = await poetOwnerService.createPoem(form);
        toast.success("Poem created successfully", { id: toastId });
      }

      onSuccess(res.data.poem);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-xl flex flex-col">

        {/* ================= HEADER ================= */}
        <div className="px-6 py-4 border-b border-base-300/40 flex justify-between items-center">
          <h2 className="text-xl font-serif font-semibold">
            {poem ? "Edit Poem" : "Add Poem"}
          </h2>
          <button
            type="button"
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

            {/* Title */}
            <div>
              <label className="text-sm text-base-content/70">Title *</label>
              <input
                required
                value={form.title}
                onChange={e =>
                  setForm({ ...form, title: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
                placeholder="Poem title"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm text-base-content/70">Category *</label>
              <select
                required
                value={form.category}
                onChange={e =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full mt-1 px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
              >
                <option value="">— Select category —</option>
                {categories?.categories?.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hindi */}
            <div>
              <label className="text-sm text-base-content/70">Hindi *</label>
              <textarea
                required
                rows={4}
                className="w-full mt-1 px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
                value={form.content.hindi}
                onChange={e =>
                  setForm({
                    ...form,
                    content: { ...form.content, hindi: e.target.value }
                  })
                }
              />
            </div>

            {/* Roman */}
            <div>
              <label className="text-sm text-base-content/70">Roman *</label>
              <textarea
                required
                rows={4}
                className="w-full mt-1 px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40 italic"
                value={form.content.roman}
                onChange={e =>
                  setForm({
                    ...form,
                    content: { ...form.content, roman: e.target.value }
                  })
                }
              />
            </div>

          </div>

          {/* ===== FOOTER ===== */}
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
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-primary text-primary-content disabled:opacity-60"
            >
              {poem ? "Update" : "Create"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PoetOwnerPoemForm;
