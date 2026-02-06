import BookForm from '../../components/admin/BookForm';
import { adminService } from '../../services/admin.service';
import { useNavigate } from 'react-router';

const AddBook = () => {
  const navigate = useNavigate();

  const createBook = async (data) => {
    await adminService.createBook(data);
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
