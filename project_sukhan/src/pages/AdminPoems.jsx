import { useEffect, useState, useRef } from 'react';
import { adminService } from '../services/admin.service';
import PoemForm from '../components/PoemForm';
import ConfirmDelete from '../components/ConfirmDelete';
import AdminPoemsShimmer from '../shimmer/AdminPoemsShimmer';

const AdminPoems = () => {
  const [poems, setPoems] = useState([]);
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


  const loadPoems = async (pageNo = 1) => {
    try {
      if (pageNo === 1) setInitialLoading(true);
      else setLoading(true);

      const res = await adminService.getPoems({
        page: pageNo,
        limit: 12,
        q: debouncedSearch || undefined
      });

      const { poems: newPoems, pagination } = res.data;

      setPoems(prev =>
        pageNo === 1 ? newPoems : [...prev, ...newPoems]
      );

      setHasNext(pagination.hasNext);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
    setPoems([]);
    loadPoems(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!hasNext) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNext && !loading && !initialLoading) {
          setPage(prev => prev + 1);
        }
      },
      { rootMargin: '300px' }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNext, loading, initialLoading]);
  useEffect(() => {
    if (page > 1) loadPoems(page);
  }, [page]);

  if (initialLoading) return <AdminPoemsShimmer />;

  return (
    <div className="min-h-screen bg-base-100 px-4 md:px-6 py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-serif font-semibold text-base-content shrink-0">
          Manage Poems
        </h1>

        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search poems, poets, content…"
            className="
              w-full
              px-4 py-2
              rounded-lg
              bg-base-200/60
              border border-base-300/40
              text-base-content
              placeholder:text-base-content/40
              focus:outline-none
              focus:ring-2 focus:ring-primary/40
            "
          />
        </div>

        <button
          onClick={() => {
            setEditingPoem(null);
            setShowForm(true);
          }}
          className="
            px-5 py-2 rounded-lg
            bg-primary text-primary-content
            hover:bg-primary/90
            transition
          "
        >
          + Add Poem
        </button>
      </div>
      

      {poems.length === 0 && (
        <div className="text-center py-10 text-base-content/60">
          No poems found
        </div>
      )}

      {/* ===================== DESKTOP TABLE ===================== */}
      <div className="hidden md:block">
        <div className="
          bg-base-100
          rounded-xl
          border border-base-300/40
          shadow-lg
          overflow-hidden
        ">
          <table className="w-full">
            <thead className="border-b border-base-300/40 bg-base-200/30 shadow-sm sticky top-0">
              <tr>
                <th className="p-4 text-left font-medium text-base-content">Title</th>
                <th className="p-4 text-left font-medium text-base-content">Poet</th>
                <th className="p-4 text-left font-medium text-base-content">Category</th>
                <th className="p-4 text-right font-medium text-base-content">Actions</th>
              </tr>
            </thead>

            <tbody>
              {poems.map(poem => (
                <tr
                  key={poem._id}
                  className="
                    border-t border-base-300/30
                    hover:bg-base-200/40
                    transition
                  "
                >
                  <td className="p-4 text-base-content">
                    {poem.title}
                  </td>
                  <td className="p-4 text-base-content/80">
                    {poem.poet?.name || '—'}
                  </td>
                  <td className="p-4 text-base-content/70">
                    {poem.category?.name || '—'}
                  </td>
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

      {/* ===================== MOBILE CARDS ===================== */}
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
              Poet: <span className="text-base-content/90">{poem.poet?.name || '—'}</span>
            </p>

            <p className="text-sm text-base-content/60">
              Category: {poem.category?.name || '—'}
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

      {/* ===================== MODALS ===================== */}

      {hasNext && (
        <div ref={observerRef} className="h-1 w-full">
          {loading && <AdminPoemsShimmer />}
        </div>
      )}


      {showForm && (
        <PoemForm
          poem={editingPoem}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadPoems();
          }}
        />
      )}

      {deletePoem && (
        <ConfirmDelete
          title={`Delete "${deletePoem.title}"?`}
          onCancel={() => setDeletePoem(null)}
          onConfirm={async () => {
            await adminService.deletePoem(deletePoem._id);
            setDeletePoem(null);
            loadPoems();
          }}
        />
      )}
    </div>
  );
};

export default AdminPoems;
