import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories } from '../../redux/slices/categorySlice';
import { adminService } from '../../services/admin.service';
import toast from 'react-hot-toast';

const CollectionForm = ({ collection, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.categories);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [featured, setFeatured] = useState(false);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  /* ================= EDIT MODE ================= */
  useEffect(() => {
    if (collection) {
      setName(collection.name || '');
      setDescription(collection.description || '');
      setCategory(collection.category?._id || '');
      setFeatured(collection.featured || false);
      setImage(collection.image || '');
    }
  }, [collection]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      return toast.error('Name and description are required');
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      category: category || null,
      featured,
      image
    };

    const toastId = toast.loading(
      collection ? 'Updating collection...' : 'Creating collection...'
    );

    try {
      setLoading(true);

      if (collection) {
        await adminService.updateCollection(collection._id, payload);
      } else {
        await adminService.createCollection(payload);
      }

      toast.success(
        collection ? 'Collection updated' : 'Collection created',
        { id: toastId }
      );

      onSuccess?.();

    } catch (err) {
      console.error(err);
      toast.error('Failed to save collection', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-lg">

        {/* HEADER */}
        <div className="px-6 py-4 border-b border-base-300/40 flex justify-between items-center">
          <h2 className="text-xl font-serif font-semibold">
            {collection ? 'Edit Collection' : 'Add Collection'}
          </h2>
          <button onClick={onClose} className="text-base-content/60 hover:text-error">
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Name */}
          <div>
            <label className="text-sm text-base-content/70">Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
              placeholder="e.g. Ishq aur Hijr"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-base-content/70">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
              placeholder="Short description of the collection"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm text-base-content/70">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
            >
              <option value="">— Select category —</option>
              {categories?.categories?.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image */}
          <div>
            <label className="text-sm text-base-content/70">Image URL</label>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
              placeholder="https://image-url"
            />
          </div>

          {/* Image Preview */}
          {image && (
            <div className="flex items-center gap-4 mt-2">
              <img
                src={image}
                alt="Image Preview"
                className="w-16 h-16 rounded-lg object-cover border border-base-300"
                onError={(e) => {
                  e.target.src = '';
                }}
              />
              <p className="text-sm text-base-content/60">
                Preview
              </p>
            </div>
          )}

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="checkbox checkbox-primary"
            />
            <span className="text-sm">Featured collection</span>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-base-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-primary text-primary-content disabled:opacity-60"
            >
              {collection ? 'Update' : 'Create'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CollectionForm;
