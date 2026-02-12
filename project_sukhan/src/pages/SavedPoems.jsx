import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '@/utils/axiosClient';
import PoemCard from '@/components/PoemCard';

const SavedPoems = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH SAVED POEMS ================= */
  const fetchSavedPoems = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/auth/savedPoems');
      setPoems(res.data.savedPoems || []);
    } catch (err) {
      console.error('Error fetching saved poems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchSavedPoems();
  }, [isAuthenticated]);

  /* ================= NOT LOGGED IN ================= */
  if (!isAuthenticated) {
    return (
      <div className="bg-base-100 min-h-screen flex items-center justify-center text-base-content/60">
        Please login to see your saved poems.
      </div>
    );
  }

  return (
    <div className="bg-base-100 min-h-screen text-base-content">

      {/* ================= HEADER ================= */}
      <div className="border-b border-base-300/40 sticky top-0 bg-base-100 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-serif font-semibold">
            Saved Poems
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Poems you saved to read again
          </p>
        </div>
      </div>

      {/* ================= POEMS ================= */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {loading && (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-base-200 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && poems.length === 0 && (
          <p className="text-center text-base-content/60">
            You haven’t saved any poems yet.
          </p>
        )}

        <div className="space-y-6">
          {poems.map(poem => (
            <div
              key={poem._id}
              onClick={() => navigate(`/poems/${poem._id}`)}
              className="cursor-pointer"
            >
              <PoemCard poem={poem} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SavedPoems;
