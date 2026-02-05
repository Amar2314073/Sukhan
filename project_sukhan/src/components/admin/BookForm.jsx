import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin.service';


const BookForm = ({ initialData = {}, onSubmit }) => {
  const [form, setForm] = useState({
    title: initialData.title || '',
    author: initialData.author || '',
    coverImage: initialData.coverImage || '',
    affiliateLink: initialData.affiliateLink || '',
    price: initialData.price || '',
    category: initialData.category || '',
    language: initialData.language || ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Poet search
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
        const res = await adminService.searchPoets(poetQuery);
        setPoetResults(res.data.poets);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPoets(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [poetQuery, poetSelected]);



  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: form.price ? Number(form.price) : null
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
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="input input-bordered w-full"
        />

      <input
        name="category"
        placeholder="Category (e.g. Ghazal, Poetry, Novel)"
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


      <button className="btn btn-primary w-full">
        Save Book
      </button>
    </form>
  );
};

export default BookForm;
