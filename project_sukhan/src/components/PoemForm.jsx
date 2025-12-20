import { useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';

const PoemForm = ({ poem, onClose, onSuccess }) => {
  const [poets, setPoets] = useState([]);
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    fetch('http://localhost:5000/api/poets')
      .then(res => res.json())
      .then(data => setPoets(data.poets || []));

    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []));
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    };

    if (poem) {
      await adminService.updatePoem(poem._id, payload);
    } else {
      await adminService.createPoem(payload);
    }

    onSuccess();
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
            <option value="">Select Poet</option>
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
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* CONTENT */}
        <textarea
          placeholder="Urdu (optional)"
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
