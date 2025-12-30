import { useEffect, useState, useRef } from 'react';
import { adminService } from '../../services/admin.service';
import PoetForm from '../../components/admin/PoetForm';
import ConfirmDelete from '../../components/admin/ConfirmDelete';
import AdminPoemsShimmer from '../../shimmer/AdminPoemsShimmer';

const AdminPoets = () => {
  const [poets, setPoets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingPoet, setEditingPoet] = useState(null);
  const [deletePoet, setDeletePoet] = useState(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const observerRef = useRef(null);

  const loadPoets = async (pageNo = 1) => {
    try {
      if (pageNo === 1) setInitialLoading(true);
      else setLoading(true);

      const res = await adminService.getPoets({
        page: pageNo,
        limit: 12,
        search: debouncedSearch.trim() || undefined
      });

      const { poets: newPoets, pagination } = res.data;

      setPoets(prev =>
        pageNo === 1 ? newPoets : [...prev, ...newPoets]
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
    loadPoets(1);
  }, []);

  useEffect(() => {
    setPage(1);
    setPoets([]);
    loadPoets(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);


  useEffect(() => {
    if (!hasNext) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && !initialLoading) {
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
    if (page > 1) {
      loadPoets(page);
    }
  }, [page]);

  if (initialLoading) return <AdminPoemsShimmer />;

  return (
    <div className="min-h-screen bg-base-100 px-4 md:px-6 py-6">

      {/* ===================== HEADER ===================== */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-serif font-semibold text-base-content shrink-0">
          Manage Poets
        </h1>

        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search poets, era, years…"
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
            setEditingPoet(null);
            setShowForm(true);
          }}
          className="
            px-5 py-2 rounded-lg
            bg-primary text-primary-content
            hover:bg-primary/90
            transition
            shrink-0
          "
        >
          + Add Poet
        </button>
      </div>

      {/* NO RESULT */}
      {!loading && poets.length === 0 && (
        <div className="text-center py-10 text-base-content/60">
          No poets found
        </div>
      )}

      {/* ===================== DESKTOP TABLE ===================== */}
      <div className="hidden md:block">
        <div
          className="
            bg-base-100
            rounded-xl
            border border-base-300/40
            shadow-lg
            overflow-hidden
          "
        >
          <table className="w-full">
            <thead className="border-b border-base-300/40 bg-base-200/30 shadow-sm sticky top-0">
              <tr>
                <th className="p-4 text-left font-medium text-base-content">
                  Name
                </th>
                <th className="p-4 text-left font-medium text-base-content">
                  Era
                </th>
                <th className="p-4 text-left font-medium text-base-content">
                  Years
                </th>
                <th className="p-4 text-right font-medium text-base-content">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {poets.map(poet => (
                <tr
                  key={poet._id}
                  className="
                    border-t border-base-300/30
                    hover:bg-base-200/40
                    transition
                  "
                >
                  <td className="p-4 text-base-content font-medium">
                    {poet.name}
                  </td>
                  <td className="p-4 text-base-content/80">
                    {poet.era || '—'}
                  </td>
                  <td className="p-4 text-base-content/70">
                    {poet.birthYear || '—'} – {poet.deathYear || '—'}
                  </td>
                  <td className="p-4 text-right space-x-4">
                    <button
                      onClick={() => {
                        setEditingPoet(poet);
                        setShowForm(true);
                      }}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletePoet(poet)}
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
        {poets.map(poet => (
          <div
            key={poet._id}
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
              {poet.name}
            </h3>

            <p className="text-sm text-base-content/70">
              Era: <span className="text-base-content/90">{poet.era || '—'}</span>
            </p>

            <p className="text-sm text-base-content/60">
              Years: {poet.birthYear || '—'} – {poet.deathYear || '—'}
            </p>

            <div className="flex gap-6 pt-3">
              <button
                onClick={() => {
                  setEditingPoet(poet);
                  setShowForm(true);
                }}
                className="text-primary text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => setDeletePoet(poet)}
                className="text-error text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {hasNext && (
        <div ref={observerRef} className="h-1 w-full">
          {loading && <AdminPoemsShimmer />}
        </div>
      )}


      {/* ===================== MODALS ===================== */}
      {showForm && (
        <PoetForm
          poet={editingPoet}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadPoets();
          }}
        />
      )}

      {deletePoet && (
        <ConfirmDelete
          title={`Delete "${deletePoet.name}"?`}
          onCancel={() => setDeletePoet(null)}
          onConfirm={async () => {
            await adminService.deletePoet(deletePoet._id);
            setDeletePoet(null);
            loadPoets();
          }}
        />
      )}
    </div>
  );
};

export default AdminPoets;
