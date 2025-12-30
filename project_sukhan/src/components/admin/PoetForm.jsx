import { useState } from 'react';
import { adminService } from '../../services/admin.service';
import toast from 'react-hot-toast';

const PoetForm = ({ poet, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: poet?.name || '',
    bio: poet?.bio || '',
    era: poet?.era || 'Classical',
    birthYear: Number(poet?.birthYear) || '',
    deathYear: Number(poet?.deathYear) || '',
    country: poet?.country || '',
    image: poet?.image || ''
  });

  const submit = async (e) => {
    e.preventDefault();

    toast.loading(poet ? 'Updating poet...' : 'Saving poet...', {
      id: 'poet-save'
    });

    if (poet) {
      await adminService.updatePoet(poet._id, form);
      toast.success('Poet updated successfully!', { id: 'poet-save' });
    } else {
      await adminService.createPoet(form);
      toast.success('Poet created successfully!', { id: 'poet-save' });
    }

    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={submit}
        className="bg-white w-[500px] p-6 rounded-xl space-y-4"
      >
        <h2 className="text-xl font-serif">
          {poet ? 'Edit Poet' : 'Add Poet'}
        </h2>

        <input
          required
          placeholder="Name"
          className="input input-bordered w-full"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          placeholder="Bio"
          className="textarea textarea-bordered w-full"
          value={form.bio}
          onChange={e => setForm({ ...form, bio: e.target.value })}
        />

        <select
          className="select select-bordered w-full"
          value={form.era}
          onChange={e => setForm({ ...form, era: e.target.value })}
        >
          <option value='Classical'>Classical</option>
          <option value='Modern'>Modern</option>
          <option value='Contemporary'>Contemporary</option>
          <option value='Other'>Other</option>
        </select>

        <div className="flex gap-3">
          <input
            placeholder="Birth Year"
            className="input input-bordered w-full"
            value={form.birthYear}
            onChange={e => setForm({ ...form, birthYear: e.target.value })}
          />
          <input
            placeholder="Death Year"
            className="input input-bordered w-full"
            value={form.deathYear}
            onChange={e => setForm({ ...form, deathYear: e.target.value })}
          />
          <input
            placeholder="Country"
            className="input input-bordered w-full"
            value={form.country}
            onChange={e => setForm({ ...form, country: e.target.value })}
          />
        </div>

        <input
          placeholder="Image URL"
          className="input input-bordered w-full"
          value={form.image}
          onChange={e => setForm({ ...form, image: e.target.value })}
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

export default PoetForm;
