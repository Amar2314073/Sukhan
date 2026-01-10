import { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { 
  getAllCategories, 
  clearCurrentCategory,
  clearError 
} from '../../redux/slices/categorySlice';
import { useSelector } from 'react-redux';

const PoemForm = ({ poem, onClose, onSuccess }) => {
  const [poets, setPoets] = useState([]);
  const [poetQuery, setPoetQuery] = useState('');
  const [poetResults, setPoetResults] = useState([]);
  const [loadingPoets, setLoadingPoets] = useState(false);


  useEffect(() => {
    if (!poetQuery.trim()) {
      setPoetResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoadingPoets(true);
        const res = await adminService.searchPoets(poetQuery);
        setPoetResults(res.data.poets);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPoets(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [poetQuery]);

  useEffect(() => {
    if (poem?.poet) {
      setPoetQuery(poem.poet.name);
    }
  }, [poem]);



  const { 
    categories, 
    currentCategory,
    loading: categoriesLoading 
  } = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    title: poem?.title || '',
    poet: poem?.poet?._id || '',
    category: poem?.category?._id || '',
    content: {
      urdu: poem?.content?.urdu || '',
      hindi: poem?.content?.hindi || '',
      roman: poem?.content?.roman || ''
    },
    tags: poem?.tags?.join(', ') || ''
  });
  const poetNames = async () => {
    try {
      const response = await adminService.getPoetNames();
      setPoets(response.data.poets);
      } catch (error) {
        console.error('Error fetching poet names:', error);
    } 
  };

  useEffect(() => {
    poetNames();
    dispatch(getAllCategories());
  }, [dispatch]);

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    };

    toast.loading(poem ? 'Updating poem...' : 'Saving poem...', {
      id: 'poem-save'
    });

    try {
      if (poem) {
        await adminService.updatePoem(poem._id, payload);
        toast.success('Poem updated successfully', { id: 'poem-save' });
      } else {
        await adminService.createPoem(payload);
        toast.success('Poem added successfully', { id: 'poem-save' });
      }

      onSuccess();

    } catch (error) {
      toast.error('Something went wrong', { id: 'poem-save' });
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <form
        onSubmit={submit}
        className="bg-white w-[700px] p-6 rounded-xl space-y-4"
      >
        <h2 className="text-xl font-serif">
          {poem ? 'Edit Poem' : 'Add Poem'}
        </h2>

        <input
          required
          placeholder="Title"
          className="input input-bordered w-full"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input
              placeholder="Search poet..."
              className="input input-bordered w-full"
              value={poetQuery}
              onChange={(e) => setPoetQuery(e.target.value)}
            />

            {loadingPoets && (
              <div className="absolute z-10 bg-base-200 w-full p-2 text-sm text-base-content border rounded mt-1">
                Searching...
              </div>
            )}

            {poetResults.length > 0 && (
              <ul className="absolute z-10 bg-base-100 border border-base-300 w-full rounded-lg shadow mt-1 max-h-48 overflow-y-auto">
                {poetResults.map((p) => (
                  <li
                    key={p._id}
                    onClick={() => {
                      setForm({ ...form, poet: p._id });
                      setPoetQuery(p.name);
                      setPoetResults([]);
                    }}
                    className="
                      px-3 py-2 cursor-pointer
                      text-base-content
                      hover:bg-base-200
                      transition-colors
                    "
                  >
                    {p.name}
                  </li>
                ))}
              </ul>
            )}
          </div>



          <select
            required
            className="select select-bordered"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Category</option>
            {categories?.categories?.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* CONTENT */}
        <textarea
          placeholder="Urdu"
          className="textarea textarea-bordered w-full font-urdu text-right"
          value={form.content.urdu}
          onChange={e =>
            setForm({ ...form, content: { ...form.content, urdu: e.target.value } })
          }
        />

        <textarea
          placeholder="Hindi"
          className="textarea textarea-bordered w-full"
          value={form.content.hindi}
          onChange={e =>
            setForm({ ...form, content: { ...form.content, hindi: e.target.value } })
          }
        />

        <textarea
          placeholder="Roman"
          className="textarea textarea-bordered w-full italic"
          value={form.content.roman}
          onChange={e =>
            setForm({ ...form, content: { ...form.content, roman: e.target.value } })
          }
        />

        <input
          placeholder="Tags (comma separated)"
          className="input input-bordered w-full"
          value={form.tags}
          onChange={e => setForm({ ...form, tags: e.target.value })}
        />

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn">
            Cancel
          </button>
          <button className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default PoemForm;
