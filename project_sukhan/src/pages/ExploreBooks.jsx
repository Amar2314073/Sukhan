import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import BookCard from '../components/BookCard';

const ExploreBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axiosClient.get('/books');
      setBooks(res.data.books);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center py-20">Loading books…</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-serif mb-8">
        Explore Books
      </h1>

      <div className="flex flex-col md:grid md:grid-cols-4 gap-6">
        {books.map(book => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default ExploreBooks;
