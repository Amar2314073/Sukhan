import BookForm from '../../components/admin/BookForm';
import axiosClient from '../../utils/axiosClient';
import { useNavigate } from 'react-router';

const AddBook = () => {
  const navigate = useNavigate();

  const createBook = async (data) => {
    await axiosClient.post('/books', data);
    navigate('/admin/books');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Add Book</h1>
      <BookForm onSubmit={createBook} />
    </div>
  );
};

export default AddBook;
