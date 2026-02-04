import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axiosClient from '../../utils/axiosClient';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const res = await axiosClient.get('/books');
    setBooks(res.data.books);
  };

  const deleteBook = async (id) => {
    if (!confirm('Delete this book?')) return;
    await axiosClient.delete(`/books/${id}`);
    fetchBooks();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Books</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/admin/books/add')}
        >
          + Add Book
        </button>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-4 gap-6">
        {books.map(book => (
          <div key={book._id} className="bg-base-200 p-3 rounded">
            <img src={book.image} className="w-full object-cover" />
            <p className="mt-2 text-sm">{book.title}</p>

            <div className="flex gap-2 mt-2">
              <button
                className="btn btn-xs"
                onClick={() => navigate(`/admin/books/edit/${book._id}`)}
              >
                Edit
              </button>
              <button
                className="btn btn-xs btn-error"
                onClick={() => deleteBook(book._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBooks;
