import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import { toggleLikePoem, toggleSavePoem } from '../redux/slices/authSlice';

const PoemCard = ({ poem }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector(state => state.auth);

  const isLiked = user?.likedPoems?.includes(poem._id);
  const isSaved = user?.savedPoems?.includes(poem._id);

  const requireLogin = (action) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    action();
  };

  return (
    <div className="bg-base-200 rounded-xl p-5 hover:bg-amber-100 transition">

      {/* POEM TEXT */}
      <Link to={`/poems/${poem._id}`}>
        <p className="font-serif italic line-clamp-3 text-gray-500 leading-relaxed">
          {poem.content?.hindi || poem.content?.roman}
        </p>
      </Link>

      {/* POET */}
      <p className="text-sm text-gray-600 mt-2">
        — {poem.poet?.name}
      </p>

      {/* ACTION BAR */}
      <div className="flex items-center justify-between mt-4">

        <div className="flex items-center gap-5">

          {/* ❤️ LIKE */}
          <button
            onClick={() =>
              requireLogin(() => dispatch(toggleLikePoem(poem._id)))
            }
            className={`flex items-center gap-1 transition
              ${isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-500'}
            `}
          >
            ❤️
            <span className="text-sm">{poem.likes || 0}</span>
          </button>

          {/* 🔖 SAVE */}
          <button
            onClick={() =>
              requireLogin(() => dispatch(toggleSavePoem(poem._id)))
            }
            className={`transition
              ${isSaved ? 'text-amber-700' : 'text-gray-500 hover:text-amber-600'}
            `}
          >
            🔖
          </button>

        </div>

        {/* READ */}
        <Link
          to={`/poems/${poem._id}`}
          className="text-sm text-amber-700 hover:underline"
        >
          Read →
        </Link>

      </div>
    </div>
  );
};

export default PoemCard;
