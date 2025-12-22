import { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getPoetById, getPoemsByPoet, clearCurrentPoet } from '../redux/slices/poetSlice';

const PoetProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentPoet, poetPoems, loading, error } = useSelector(
    state => state.poets
  );

  useEffect(() => {
    dispatch(getPoetById(id));
    dispatch(getPoemsByPoet(id));

    return () => {
      dispatch(clearCurrentPoet());
    };
  }, [id, dispatch]);

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!currentPoet) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* 🔹 Poet Header */}
      <div className="flex gap-6 items-center mb-8">
        <img
          src={currentPoet.image || '/poet-placeholder.png'}
          alt={currentPoet.name}
          className="w-28 h-28 rounded-full object-cover border"
        />
        <div>
          <h1 className="text-3xl font-serif font-bold">
            {currentPoet.name}
          </h1>
          <p className="text-gray-600 mt-1">
            {currentPoet.birthYear || '—'} – {currentPoet.deathYear || '—'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {currentPoet.era}
          </p>
        </div>
      </div>

      {/* 🔹 Bio */}
      <p className="mb-10 leading-relaxed text-gray-700">
        {currentPoet.bio}
      </p>

      {/* 🔹 Poems List */}
      <h2 className="text-2xl font-serif mb-4">
        Ghazals & Poems
      </h2>

      {poetPoems.length === 0 ? (
        <p>No poems available.</p>
      ) : (
        <div className="space-y-4">
          {poetPoems.map(poem => (
            <Link
              key={poem._id}
              to={`/poems/${poem._id}`}
              className="block border-b pb-3 hover:text-amber-700"
            >
              <p className="italic line-clamp-2">
                {poem.content?.hindi || poem.content?.roman}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PoetProfile;

// https://rekhta.pc.cdn.bitgravity.com/Images/poet-profile-banner.png