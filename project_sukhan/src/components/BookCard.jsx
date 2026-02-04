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
      <img
        src={book.image}
        alt={book.title}
        className="w-full object-cover"
      />
    </div>
  );
};

export default BookCard;
