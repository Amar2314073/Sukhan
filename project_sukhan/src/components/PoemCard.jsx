import { Link, useNavigate } from "react-router";
import { Heart, Bookmark } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLikePoem, toggleSavePoem } from "@/redux/slices/authSlice"

const PoemCard = ({ poem }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const misre =
    poem.content?.hindi
      ?.split("\n")
      .filter(Boolean)
      .slice(0, 2) || [];

    const { user, isAuthenticated } = useSelector(state => state.auth);

    const handleLike = (e) => {
      e.stopPropagation();

      if (!isAuthenticated) {
        navigate('/register', {
          state: { redirectTo: `/poems/${poem._id}` }
        });
        return;
      }

      dispatch(toggleLikePoem(poem._id));
    };

    const handleSave = (e) => {
      e.stopPropagation();

      if (!isAuthenticated) {
        navigate('/register', {
          state: { redirectTo: `/poems/${poem._id}` }
        });
        return;
      }

      dispatch(toggleSavePoem(poem._id));
    };


  return (
    <div
      onClick={() => navigate(`/poems/${poem._id}`)}
      className="
        relative group block rounded-2xl
        px-7 py-6
        bg-base-200/40
        border border-base-300/40
        hover:bg-base-200/60
        transition
      "
    >
      {/* light sweep */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-r
          from-transparent via-white/5 to-transparent
          opacity-0 group-hover:opacity-100
        "
      />

      {/* poem lines */}
      <div className="space-y-1">
        {misre.map((line, i) => (
          <p
            key={i}
            className="
              font-serif
              text-lg
              leading-relaxed
              text-base-content
            "
          >
            {line}
          </p>
        ))}
      </div>

      {/* poet */}
      {poem.poet && (
        <div className="mt-4 text-sm text-base-content/60">
          — by{" "}
          <Link
            to={`/poets/${poem.poet._id}`}
            onClick={e => e.stopPropagation()}
            className="hover:text-primary underline-offset-2 hover:underline"
          >
            {poem.poet.name}
          </Link>
        </div>
      )}

      {/* ACTIONS */}
      <div
        className="
          absolute bottom-5 right-6
          flex gap-4
          z-10
        "
      >
        {/* LIKE */}
        <button
          onClick={handleLike}
          className="transition hover:scale-110"
        >
          <Heart
            size={18}
            className={
              user?.likedPoems?.some(id => id.toString() === poem._id)
                ? 'fill-red-500 text-red-500'
                : 'text-base-content/50 hover:text-red-500'
            }
          />
        </button>

        {/* SAVE */}
        <button
          onClick={handleSave}
          className="transition hover:scale-110"
        >
          <Bookmark
            size={18}
            className={
              user?.savedPoems?.some(id => id.toString() === poem._id)
                ? 'fill-primary text-primary'
                : 'text-base-content/50 hover:text-primary'
            }
          />
        </button>
      </div>

    </div>
  );
};

export default PoemCard;
