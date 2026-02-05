import axiosClient from '../utils/axiosClient';

const BookCard = ({ book }) => {
  const handleClick = async () => {
    try {
      const res = await axiosClient.post(`/books/${book._id}/click`);
      window.open(res.data.redirectUrl, '_blank');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="
        group cursor-pointer
        w-[180px]
        rounded-xl
        bg-base-200
        hover:bg-base-100
        transition-all duration-300
        shadow-sm hover:shadow-xl
      "
    >
      {/* COVER */}
      <div className="aspect-[2/3] bg-base-300 flex items-center justify-center rounded-t-xl overflow-hidden">
        <img
          src={book.coverImage}
          alt={book.title}
          className="
            max-h-full w-auto
            object-contain
            transition-transform duration-300
            group-hover:scale-105
          "
        />
      </div>

      {/* INFO */}
      <div className="p-3 space-y-1">
        <h3 className="text-sm font-serif font-semibold line-clamp-2">
          {book.title}
        </h3>

        {book.author && (
          <p className="text-xs italic text-base-content/60">
            {book.author}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          {book.category && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-base-300 text-base-content/70">
              {book.category}
            </span>
          )}

          {book.language && (
            <span className="text-[10px] text-base-content/50">
              {book.language}
            </span>
          )}
        </div>

        {book.price && (
          <p className="pt-2 text-sm font-semibold text-primary">
            ₹{book.price}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookCard;
