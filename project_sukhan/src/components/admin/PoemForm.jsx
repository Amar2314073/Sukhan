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
  const { 
    categories, 
    currentCategory,
    loading: categoriesLoading 
  } = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  console.log('Categories in PoemForm:', categories);


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
          <select
            required
            className="select select-bordered"
            value={form.poet}
            onChange={e => setForm({ ...form, poet: e.target.value })}
          >
            <option value="">Poet</option>
            {poets.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>

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
