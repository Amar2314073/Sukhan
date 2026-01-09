import { useEffect, useState, useRef } from 'react';
import { adminService } from '../../services/admin.service';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories } from '../../redux/slices/categorySlice';
import PoemForm from '../../components/admin/PoemForm';
import ConfirmDelete from '../../components/admin/ConfirmDelete';
import AdminPoemsShimmer from '../../shimmer/AdminPoemsShimmer';
import toast from 'react-hot-toast';

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
  const loadPoems = async (pageNo = 1) => {
    try {
      pageNo === 1 ? setInitialLoading(true) : setLoading(true);

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
  };

  /* ================= RELOAD ON FILTER CHANGE ================= */
  useEffect(() => {
    if (!activeCategoryId) return;
    setPage(1);
    setPoems([]);
    loadPoems(1);
  }, [activeCategoryId, debouncedSearch]);

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
  }, [page]);

  if (initialLoading) return <AdminPoemsShimmer />;

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

      {poems.length === 0 && (
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
                className="text-error text-sm"
              >
                Delete
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
        <ConfirmDelete
          title={`Delete "${deletePoem.title}"?`}
          onCancel={() => setDeletePoem(null)}
          onConfirm={async () => {
            const toastId = toast.loading('Deleting poem...');

            try {
              await adminService.deletePoem(deletePoem._id);

              toast.success('Poem deleted successfully', {
                id: toastId
              });

              setDeletePoem(null);
              setPage(1);
              setPoems([]);
              loadPoems(1);
            } catch (err) {
              toast.error('Failed to delete poem', {
                id: toastId
              });
              console.error(err);
            }
          }}

        />
      )}
    </div>
  );
};

export default AdminPoems;
