import { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories } from '../../redux/slices/categorySlice';
import toast from 'react-hot-toast';
import { searchService } from '../../services/search.service';

const PoemForm = ({ poem, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.categories);

  /* ================= POET SEARCH ================= */
  const [poetQuery, setPoetQuery] = useState('');
  const [poetResults, setPoetResults] = useState([]);
  const [loadingPoets, setLoadingPoets] = useState(false);
  const [poetSelected, setPoetSelected] = useState(false);

  useEffect(() => {
    if (!poetQuery.trim() || poetSelected) {
      setPoetResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoadingPoets(true);
        const res = await searchService.searchPoets(poetQuery);
        setPoetResults(res.data.poets);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPoets(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [poetQuery, poetSelected]);

  useEffect(() => {
    if (poem?.poet) {
      setPoetQuery(poem.poet.name);
      setPoetSelected(true);
    }
  }, [poem]);

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    title: poem?.title || '',
    poet: poem?.poet?._id || '',
    category: poem?.category?._id || '',
    featured: poem?.featured || false,
    content: {
      hindi: poem?.content?.hindi || '',
      roman: poem?.content?.roman || ''
    }
  });

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading(
      poem ? 'Updating poem...' : 'Creating poem...'
    );

    try {
      if (poem) {
        await adminService.updatePoem(poem._id, form);
        toast.success('Poem updated successfully', { id: toastId });
      } else {
        await adminService.createPoem(form);
        toast.success('Poem created successfully', { id: toastId });
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong', { id: toastId });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-xl flex flex-col">

        {/* ================= HEADER ================= */}
        <div className="px-6 py-4 border-b border-base-300/40 flex justify-between items-center">
          <h2 className="text-xl font-serif font-semibold">
            {poem ? 'Edit Poem' : 'Add Poem'}
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

            {/* Title */}
            <div>
              <label className="text-sm text-base-content/70">Title *</label>
              <input
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full mt-1 px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
                placeholder="Poem title"
              />
            </div>

            {/* Poet + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Poet */}
              <div className="relative">
                <label className="text-sm text-base-content/70">Poet *</label>
                <input
                  required
                  value={poetQuery}
                  onChange={(e) => {
                    setPoetQuery(e.target.value);
                    setPoetSelected(false);
                  }}
                  className="w-full mt-1 px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
                  placeholder="Search poet..."
                />

                {loadingPoets && (
                  <div className="absolute z-10 bg-base-200 w-full p-2 text-sm rounded-lg mt-1">
                    Searching…
                  </div>
                )}

                {poetResults.length > 0 && (
                  <ul className="absolute z-10 bg-base-100 border border-base-300 w-full rounded-lg shadow mt-1 max-h-48 overflow-y-auto">
                    {poetResults.map(p => (
                      <li
                        key={p._id}
                        onClick={() => {
                          setForm({ ...form, poet: p._id });
                          setPoetQuery(p.name);
                          setPoetResults([]);
                          setPoetSelected(true);
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-base-200"
                      >
                        {p.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="text-sm text-base-content/70">Category *</label>
                <select
                  required
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
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
            </div>

            {/* CONTENT */}

            <div>
              <label className="text-sm text-base-content/70">Hindi *</label>
              <textarea
                required
                rows={3}
                className="w-full mt-1 px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
                value={form.content.hindi}
                onChange={e =>
                  setForm({ ...form, content: { ...form.content, hindi: e.target.value } })
                }
              />
            </div>

            <div>
              <label className="text-sm text-base-content/70">Roman *</label>
              <textarea
                required
                rows={3}
                className="w-full mt-1 px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40 italic"
                value={form.content.roman}
                onChange={e =>
                  setForm({ ...form, content: { ...form.content, roman: e.target.value } })
                }
              />
            </div>


            {/* Featured */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => setForm({ ...form, featured: e.target.checked })}
                className="checkbox checkbox-primary"
              />
              <span className="text-sm">Featured poem</span>
            </div>

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
              {poem ? 'Update' : 'Create'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PoemForm;
