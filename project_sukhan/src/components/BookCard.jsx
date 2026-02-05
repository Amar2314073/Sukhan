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
          src={book.image}
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
    </div>

  );
};

export default BookCard;
