import { useEffect, useState, useRef } from 'react';
import { adminService } from '../../services/admin.service';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories } from '../../redux/slices/categorySlice';
import CollectionForm from '../../components/admin/CollectionForm';
import ConfirmDelete from '../../components/admin/ConfirmDelete';
import AdminPoemsShimmer from '../../shimmer/AdminPoemsShimmer';
import toast from 'react-hot-toast';

const AdminCollections = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.categories);

  const [collections, setCollections] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const hasLoadedOnceRef = useRef(false);

  const [showForm, setShowForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [deleteCollection, setDeleteCollection] = useState(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const observerRef = useRef(null);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  /* ================= DEFAULT CATEGORY ================= */
  useEffect(() => {
    if (categories?.categories?.length && !activeCategoryId) {
      setActiveCategoryId(categories.categories[0]._id);
    }
  }, [categories, activeCategoryId]);

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  /* ================= LOAD COLLECTIONS ================= */
  const loadCollections = async (pageNo = 1) => {
    try {
      if (!hasLoadedOnceRef.current) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }

      const res = await adminService.getCollections({
        page: pageNo,
        limit: 12,
        category: activeCategoryId,
        q: debouncedSearch.trim() || undefined
      });

      const { collections: newCollections, pagination } = res.data;

      setCollections(prev =>
        pageNo === 1 ? newCollections : [...prev, ...newCollections]
      );

      setHasNext(pagination.hasNext);
      hasLoadedOnceRef.current = true;

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  /* ================= RELOAD ON FILTER CHANGE ================= */
  useEffect(() => {
    if (!activeCategoryId) return;

    setPage(1);
    setCollections([]);
    setHasNext(true);
    loadCollections(1);

  }, [activeCategoryId, debouncedSearch]);

  /* ================= INFINITE SCROLL ================= */
  useEffect(() => {
    if (!hasNext) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          setPage(p => p + 1);
        }
      },
      { rootMargin: '300px' }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);
    return () => el && observer.unobserve(el);

  }, [hasNext, loading]);

  useEffect(() => {
    if (page > 1) loadCollections(page);
  }, [page]);

  /* ================= FIRST LOAD SHIMMER ================= */
  if (initialLoading && !hasLoadedOnceRef.current) {
    return <AdminPoemsShimmer />;
  }

  return (
    <div className="min-h-screen bg-base-100 px-4 md:px-6 py-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-serif font-semibold text-base-content shrink-0">
          Manage Collections
        </h1>

        <div className="flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collections…"
            className="w-full px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
          />
        </div>

        <button
          onClick={() => {
            setEditingCollection(null);
            setShowForm(true);
          }}
          className="px-5 py-2 rounded-lg bg-primary text-primary-content"
        >
          + Add Collection
        </button>
      </div>

      {/* ================= CATEGORY TABS ================= */}
      <div className="border-b border-base-300/40 mb-6">
        <div className="flex gap-6 overflow-x-auto text-sm font-medium">
          <button
            onClick={() => setActiveCategoryId(null)}
            className={`py-3 border-b-2 ${
              !activeCategoryId
                ? 'border-primary text-primary'
                : 'border-transparent text-base-content/60'
            }`}
          >
            All
          </button>

          {categories?.categories?.map(cat => (
            <button
              key={cat._id}
              onClick={() => setActiveCategoryId(cat._id)}
              className={`py-3 border-b-2 whitespace-nowrap ${
                activeCategoryId === cat._id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-base-content/60'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {collections.length === 0 && !loading && (
        <div className="text-center py-10 text-base-content/60">
          No collections found
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="hidden md:block">
        <div className="bg-base-100 rounded-xl border border-base-300/40 shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-base-300/40 bg-base-200/30">
              <tr>
                <th className="p-4 text-left font-medium">Name</th>
                <th className="p-4 text-left font-medium">Category</th>
                <th className="p-4 text-left font-medium">Poems</th>
                <th className="p-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map(col => (
                <tr
                  key={col._id}
                  className="border-t border-base-300/30 hover:bg-base-200/40"
                >
                  <td className="p-4 font-medium">{col.name}</td>
                  <td className="p-4">{col.category?.name || '—'}</td>
                  <td className="p-4">{col.poems?.length || 0}</td>
                  <td className="p-4 text-right space-x-4">
                    <button
                      onClick={() => {
                        setEditingCollection(col);
                        setShowForm(true);
                      }}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteCollection(col)}
                      className="text-error hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {hasNext && <div ref={observerRef} className="h-4" />}

      {/* ================= MODALS ================= */}
      {showForm && (
        <CollectionForm
          collection={editingCollection}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            setPage(1);
            setCollections([]);
            setHasNext(true);
            loadCollections(1);
          }}
        />
      )}

      {deleteCollection && (
        <ConfirmDelete
          title={`Delete "${deleteCollection.name}"?`}
          onCancel={() => setDeleteCollection(null)}
          onConfirm={async () => {
            const toastId = toast.loading('Deleting collection...');
            try {
              await adminService.deleteCollection(deleteCollection._id);
              toast.success('Collection deleted', { id: toastId });
              setDeleteCollection(null);
              setPage(1);
              setCollections([]);
              setHasNext(true);
              loadCollections(1);
            } catch (err) {
              toast.error('Failed to delete collection', { id: toastId });
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminCollections;
