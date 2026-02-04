import { useState } from 'react';

const BookForm = ({ initialData = {}, onSubmit }) => {
  const [form, setForm] = useState({
    title: initialData.title || '',
    coverImage: initialData.coverImage || '',
    affiliateLink: initialData.affiliateLink || '',
    poet: initialData.poet || ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      poet: form.poet || null
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md">
      <input
        name="title"
        placeholder="Book Title"
        value={form.title}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />

      <input
        name="coverImage"
        placeholder="Cover Image URL"
        value={form.coverImage}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />

      <input
        name="affiliateLink"
        placeholder="Affiliate Link"
        value={form.affiliateLink}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />

      <input
        name="poet"
        placeholder="Poet ID (optional)"
        value={form.poet}
        onChange={handleChange}
        className="input input-bordered w-full"
      />

      <button className="btn btn-primary w-full">
        Save Book
      </button>
    </form>
  );
};

export default BookForm;
