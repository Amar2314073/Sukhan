import axiosClient from '../utils/axiosClient';

const BookCard = ({ book }) => {

  const handleClick = async () => {
    try {
      const res = await axiosClient.post(`/books/${book._id}/click`);
      window.location.href = res.data.redirectUrl;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="
        cursor-pointer
        rounded-xl
        overflow-hidden
        shadow-sm
        hover:shadow-lg
        transition
        bg-base-200
      "
    >
      <div className="h-64 bg-base-300 flex items-center justify-center">
        <img
          src={book.coverImage}
          alt={book.title}
          className="
            max-h-full
            w-auto
            object-contain
            transition-transform
            duration-300
            hover:scale-105
          "
        />
      </div>
      {/* Info */}
      <div className="p-4 text-center space-y-1">
        <h3 className="text-sm font-serif font-semibold line-clamp-2">
          {book.title}
        </h3>

        {book.author && (
          <p className="text-xs text-base-content/60 italic">
            by {book.author}
          </p>
        )}
      </div>
    </div>

  );
};

export default BookCard;
