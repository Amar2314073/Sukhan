import { useEffect, useState, useRef, useCallback } from 'react';
import { adminService } from '../../services/admin.service';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories } from '../../redux/slices/categorySlice';
import PoemForm from '../../components/admin/PoemForm';
import AdminPoemsShimmer from '../../shimmer/AdminPoemsShimmer';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal';

const AdminPoems = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.categories);

  const [poems, setPoems] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingPoem, setEditingPoem] = useState(null);
  const [deletePoem, setDeletePoem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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
    }, 1000);
    return () => clearTimeout(t);
  }, [search]);

  /* ================= LOAD POEMS ================= */
  const loadPoems = useCallback(async (pageNo = 1) => {
    try {
      if (pageNo === 1 && poems.length === 0) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }


      const res = await adminService.getPoems({
        page: pageNo,
        limit: 12,
        category: activeCategoryId,
        q: debouncedSearch.trim() || undefined
      });

      const { poems: newPoems, pagination } = res.data;

      setPoems(prev =>
        pageNo === 1 ? newPoems : [...prev, ...newPoems]
      );

      setHasNext(pagination.hasNext);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  },[activeCategoryId, debouncedSearch]);

  /* ================= RELOAD ON FILTER CHANGE ================= */
  useEffect(() => {
    if (!activeCategoryId) return;
    setPage(1);
    setPoems([]);
    setHasNext(true);
    loadPoems(1);
  }, [activeCategoryId, debouncedSearch, loadPoems]);
  
  
  /* ================= Confirm Delete function ================= */
  const confirmDeletePoem = async () => {
    if (!deletePoem) return;

    const toastId = toast.loading('Deleting poem...');

    try {
      setDeletingId(deletePoem._id);

      await adminService.deletePoem(deletePoem._id);

      toast.success('Poem deleted successfully', { id: toastId });

      // Optimistic update
      setPoems(prev =>
        prev.filter(p => p._id !== deletePoem._id)
      );

      setDeletePoem(null);

    } catch (err) {
      toast.error('Failed to delete poem', { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };


  /* ================= INFINITE SCROLL ================= */
  useEffect(() => {
    if (!hasNext) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && !initialLoading) {
          setPage(p => p + 1);
        }
      },
      { rootMargin: '300px' }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);
    return () => el && observer.unobserve(el);
  }, [hasNext, loading, initialLoading]);

  useEffect(() => {
    if (page > 1) loadPoems(page);
  }, [page, loadPoems]);

  if (initialLoading && poems.length === 0) {
    return <AdminPoemsShimmer />;
  }

  return (
    <div className="min-h-screen bg-base-100 px-4 md:px-6 py-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-serif font-semibold text-base-content shrink-0">
          Manage Poems
        </h1>

        <div className="flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search poems, poets, content…"
            className="w-full px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
          />
        </div>

        {loading && (
          <div className="text-sm text-base-content/50 mt-2">
            Searching…
          </div>
        )}


        <button
          onClick={() => {
            setEditingPoem(null);
            setShowForm(true);
          }}
          className="px-5 py-2 rounded-lg bg-primary text-primary-content"
        >
          + Add Poem
        </button>
      </div>

      {/* ================= CATEGORY TABS ================= */}
      <div className="border-b border-base-300/40 mb-6">
        <div className="flex gap-6 overflow-x-auto text-sm font-medium">
          {categories?.categories?.map(cat => (
            <button
              key={cat._id}
              onClick={() => setActiveCategoryId(cat._id)}
              className={`py-3 border-b-2 whitespace-nowrap transition
                ${activeCategoryId === cat._id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-base-content/60'}
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {!initialLoading && poems.length === 0 && (
        <div className="text-center py-10 text-base-content/60">
          No poems found
        </div>
      )}

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block">
        <div className="bg-base-100 rounded-xl border border-base-300/40 shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-base-300/40 bg-base-200/30">
              <tr>
                <th className="p-4 text-left font-medium">Title</th>
                <th className="p-4 text-left font-medium">Poet</th>
                <th className="p-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {poems.map(poem => (
                <tr
                  key={poem._id}
                  className="border-t border-base-300/30 hover:bg-base-200/40"
                >
                  <td className="p-4">{poem.title}</td>
                  <td className="p-4">{poem.poet?.name || '—'}</td>
                  <td className="p-4 text-right space-x-4">
                    <button
                      onClick={() => {
                        setEditingPoem(poem);
                        setShowForm(true);
                      }}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletePoem(poem)}
                      disabled={deletingId === poem._id}
                      className={`
                        text-error hover:underline
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      {deletingId === poem._id ? 'Deleting…' : 'Delete'}
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {poems.map(poem => (
          <div
            key={poem._id}
            className="
              bg-base-100
              border border-base-300/40
              rounded-xl
              shadow-md
              p-5
              space-y-2
            "
          >
            <h3 className="text-lg font-semibold text-base-content">
              {poem.title}
            </h3>

            <p className="text-sm text-base-content/70">
              Poet:{' '}
              <span className="text-base-content/90">
                {poem.poet?.name || '—'}
              </span>
            </p>

            <div className="flex gap-6 pt-3">
              <button
                onClick={() => {
                  setEditingPoem(poem);
                  setShowForm(true);
                }}
                className="text-primary text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => setDeletePoem(poem)}
                disabled={deletingId === poem._id}
                className="
                  text-error text-sm
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {deletingId === poem._id ? 'Deleting…' : 'Delete'}
              </button>

            </div>
          </div>
        ))}
      </div>

      {hasNext && <div ref={observerRef} className="h-4" />}

      {showForm && (
        <PoemForm
          poem={editingPoem}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadPoems(1)
          }}
        />
      )}

      {deletePoem && (
        <ConfirmModal
          title={`Delete poem: "${deletePoem.title}"?`}
          message={`Are you sure you want to delete "${deletePoem.title}"? This action cannot be undone.`}
          confirmText="Delete"
          variant="error"
          loading={deletingId === deletePoem._id}
          disableCancel={deletingId === deletePoem._id}
          onCancel={() => setDeletePoem(null)}
          onConfirm={confirmDeletePoem}
        />
      )}

    </div>
  );
};

export default AdminPoems;
