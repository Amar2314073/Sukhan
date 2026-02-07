import { useState, useEffect } from 'react';
import { searchService } from '../../services/search.service';
import toast from 'react-hot-toast';

const BookForm = ({ initialData = {}, onSubmit }) => {
  const isEdit = Boolean(initialData?._id);

  const [form, setForm] = useState({
    title: initialData.title || '',
    author: initialData.author || '',
    coverImage: initialData.coverImage || '',
    affiliateLink: initialData.affiliateLink || '',
    price: initialData.price || '',
    category: initialData.category || '',
    language: initialData.language || ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= POET SEARCH ================= */
  const [poetQuery, setPoetQuery] = useState('');
  const [poetResults, setPoetResults] = useState([]);
  const [loadingPoets, setLoadingPoets] = useState(false);
  const [poetSelected, setPoetSelected] = useState(false);

  useEffect(() => {
    if (initialData.author) {
      setForm(f => ({ ...f, author: initialData.author }));
      setPoetQuery(initialData.author);
      setPoetSelected(true);
    }
  }, [initialData]);

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

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading(
      isEdit ? 'Updating book…' : 'Creating book…'
    );

    try {
      setSubmitting(true);

      await onSubmit({
        ...form,
        price: form.price ? Number(form.price) : null
      });

      toast.success(
        isEdit ? 'Book updated successfully' : 'Book created successfully',
        { id: toastId }
      );
    } catch (err) {
      toast.error('Something went wrong', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="
        space-y-4
        max-w-md
        bg-base-200
        p-6
        rounded-2xl
        border border-base-300/40
      "
    >
      <h2 className="text-xl font-serif font-semibold mb-2">
        {isEdit ? 'Update Book' : 'Create Book'}
      </h2>

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
        type="number"
        name="price"
        placeholder="Price (optional)"
        value={form.price}
        onChange={handleChange}
        className="input input-bordered w-full"
      />

      <input
        name="category"
        placeholder="Category (e.g. Ghazal, Poetry)"
        value={form.category}
        onChange={handleChange}
        className="input input-bordered w-full"
      />

      <select
        name="language"
        value={form.language}
        onChange={handleChange}
        className="select select-bordered w-full"
      >
        <option value="">Select language</option>
        <option value="Hindi">Hindi</option>
        <option value="Urdu">Urdu</option>
        <option value="English">English</option>
      </select>

      {/* ===== AUTHOR SEARCH ===== */}
      <div className="relative">
        <input
          name="author"
          placeholder="Author / Poet name"
          value={form.author}
          onChange={(e) => {
            setPoetQuery(e.target.value);
            setForm({ ...form, author: e.target.value });
            setPoetSelected(false);
          }}
          className="input input-bordered w-full"
        />

        {loadingPoets && (
          <div className="absolute z-10 bg-base-200 w-full p-2 text-sm rounded mt-1">
            Searching…
          </div>
        )}

        {!poetSelected && poetResults.length > 0 && (
          <ul className="absolute z-10 bg-base-100 border w-full rounded shadow mt-1 max-h-40 overflow-y-auto">
            {poetResults.map(p => (
              <li
                key={p._id}
                onClick={() => {
                  setForm({ ...form, author: p.name });
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

      {/* ===== ACTION BUTTON ===== */}
      <button
        type="submit"
        disabled={submitting}
        className="
          btn btn-ghost bg-base-100
          disabled:opacity-60
        "
      >
        {submitting
          ? (isEdit ? 'Updating…' : 'Creating…')
          : (isEdit ? 'Update Book' : 'Create Book')}
      </button>
    </form>
  );
};

export default BookForm;
