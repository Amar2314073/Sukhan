import { useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';
import PoemForm from '../components/PoemForm';
import ConfirmDelete from '../components/ConfirmDelete';

const AdminPoems = () => {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingPoem, setEditingPoem] = useState(null);
  const [deletePoem, setDeletePoem] = useState(null);

  const loadPoems = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:5000/api/poems');
    const data = await res.json();
    setPoems(data.poems || []);
    setLoading(false);
  };

  useEffect(() => {
    loadPoems();
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-serif">Manage Poems</h1>
        <button
          onClick={() => {
            setEditingPoem(null);
            setShowForm(true);
          }}
          className="bg-amber-700 text-white px-5 py-2 rounded-lg"
        >
          + Add Poem
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-base-100 rounded-xl shadow text-blue-400">
          <thead className="bg-gray-500">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th>Poet</th>
              <th>Category</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {poems.map(poem => (
              <tr key={poem._id} className="border-t">
                <td className="p-3">{poem.title}</td>
                <td>{poem.poet?.name}</td>
                <td>{poem.category?.name}</td>
                <td className="text-right p-3 space-x-3">
                  <button
                    onClick={() => {
                      setEditingPoem(poem);
                      setShowForm(true);
                    }}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletePoem(poem)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <PoemForm
          poem={editingPoem}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadPoems();
          }}
        />
      )}

      {deletePoem && (
        <ConfirmDelete
          title={`Delete "${deletePoem.title}"?`}
          onCancel={() => setDeletePoem(null)}
          onConfirm={async () => {
            await adminService.deletePoem(deletePoem._id);
            setDeletePoem(null);
            loadPoems();
          }}
        />
      )}
    </div>
  );
};

export default AdminPoems;
