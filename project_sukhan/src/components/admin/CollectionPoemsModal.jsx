import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import toast from 'react-hot-toast';

const CollectionPoemsModal = ({ collection, onClose, onUpdated }) => {
  const [poems, setPoems] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  /* ================= LOAD COLLECTION POEMS ================= */
  useEffect(() => {
    if (collection?.poems) {
      setPoems(collection.poems);
    }
  }, [collection]);

  /* ================= SEARCH POEMS ================= */
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      setPage(1);
      setHasNext(false);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setSearchLoading(true);

        const res = await adminService.getPoems({
          q: search,
          page,
          limit: 8,
          category: collection.category?._id
        });

        const { poems, pagination } = res.data;

        setSearchResults(prev =>
          page === 1 ? poems : [...prev, ...poems]
        );

        setHasNext(pagination.hasNext);

      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);

  }, [search, page]);

  /* ================= ADD POEM ================= */
  const addPoem = async (poemId) => {
    const toastId = toast.loading('Adding poem...');
    try {
      await adminService.addPoemToCollection(collection._id, {
        poemId
      });

      const added = searchResults.find(p => p._id === poemId);
      setPoems(prev => [...prev, added]);

      toast.success('Poem added', { id: toastId });
      onUpdated?.();
    } catch (err) {
      toast.error('Failed to add poem', { id: toastId });
    }
  };

  /* ================= REMOVE POEM ================= */
  const removePoem = async (poemId) => {
    const toastId = toast.loading('Removing poem...');
    try {
      await adminService.removePoemFromCollection(collection._id, {
        poemId
      });

      setPoems(prev => prev.filter(p => p._id !== poemId));

      toast.success('Poem removed', { id: toastId });
      onUpdated?.();
    } catch (err) {
      toast.error('Failed to remove poem', { id: toastId });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-base-100 w-full max-w-4xl rounded-2xl shadow-xl flex flex-col">

        {/* ================= HEADER ================= */}
        <div className="px-6 py-4 border-b border-base-300/40 flex justify-between">
          <h2 className="text-xl font-serif font-semibold">
            Manage Poems — {collection.name}
          </h2>
          <button
            onClick={onClose}
            className="text-base-content/60 hover:text-error"
          >
            ✕
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[70vh]">

          {/* ===== LEFT: COLLECTION POEMS ===== */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-base-content/70">
              Poems in this collection
            </h3>

            {poems.length === 0 ? (
              <p className="text-sm text-base-content/50">
                No poems added yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {poems.map(p => (
                  <li
                    key={p._id}
                    className="flex justify-between items-center bg-base-200/60 px-4 py-3 rounded-lg"
                  >
                    <span className="line-clamp-1">
                      {p.title || p.content?.hindi?.slice(0, 40)}
                    </span>
                    <button
                      onClick={() => removePoem(p._id)}
                      className="text-error text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ===== RIGHT: ADD POEMS ===== */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-base-content/70">
              Add poems
            </h3>

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                setHasNext(false);
              }}
              placeholder="Search poems..."
              className="w-full mb-3 px-4 py-2 rounded-lg bg-base-200/60 border border-base-300/40"
            />


            <ul className="space-y-2">
              {searchResults
                .filter(p => !poems.some(cp => cp._id === p._id))
                .map(p => (
                  <li
                    key={p._id}
                    className="flex justify-between items-center bg-base-200/40 px-4 py-2 rounded-lg"
                  >
                    <span className="line-clamp-1">
                      {p.title || p.content?.hindi?.slice(0, 40)}
                    </span>
                    <button
                      onClick={() => addPoem(p._id)}
                      className="text-primary text-sm hover:underline"
                    >
                      Add
                    </button>
                  </li>
                ))}
            </ul>
            {/* SEARCH LOADING */}
            {searchLoading && (
              <p className="text-center text-sm text-base-content/50 mt-3">
                Searching…
              </p>
            )}

            {/* LOAD MORE */}
            {hasNext && !searchLoading && (
              <button
                onClick={() => setPage(p => p + 1)}
                className="w-full mt-3 py-2 rounded-lg bg-base-200 text-sm hover:bg-base-300"
              >
                Load more poems
              </button>
            )}

          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="px-6 py-4 border-t border-base-300/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-base-200"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default CollectionPoemsModal;
