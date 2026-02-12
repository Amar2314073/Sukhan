import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axiosClient from '@/utils/axiosClient';
import BookForm from '@/components/admin/BookForm';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  useEffect(() => {
    axiosClient.get(`/books/${id}`).then(res => {
      setBook(res.data.book);
    });
  }, [id]);

  const updateBook = async (data) => {
    await axiosClient.put(`/admin/books/${id}`, data);
    navigate('/admin/books');
  };

  if (!book) return <p>Loading…</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Edit Book</h1>
      <BookForm initialData={book} onSubmit={updateBook} />
    </div>
  );
};

export default EditBook;
