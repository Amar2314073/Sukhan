import { useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';
import PoetForm from '../components/PoetForm';
import ConfirmDelete from '../components/ConfirmDelete';

const AdminPoets = () => {
  const [poets, setPoets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingPoet, setEditingPoet] = useState(null);

  const [deletePoet, setDeletePoet] = useState(null);

  const loadPoets = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:5000/api/poets');
    const data = await res.json();
    setPoets(data.poets || []);
    setLoading(false);
  };

  useEffect(() => {
    loadPoets();
  }, []);

  const handleEdit = (poet) => {
    setEditingPoet(poet);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingPoet(null);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-serif">Manage Poets</h1>
        <button
          onClick={handleAdd}
          className="bg-amber-700 text-white px-5 py-2 rounded-lg"
        >
          + Add Poet
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-base-100 rounded-xl shadow text-blue-400">
          <thead className="bg-gray-500">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Era</th>
              <th>Years</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {poets.map(poet => (
              <tr key={poet._id} className="border-t">
                <td className="p-3 font-medium">{poet.name}</td>
                <td>{poet.era}</td>
                <td>
                  {poet.birthYear || '—'} – {poet.deathYear || '—'}
                </td>
                <td className="text-right p-3 space-x-3">
                  <button
                    onClick={() => handleEdit(poet)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletePoet(poet)}
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

      {/* FORM MODAL */}
      {showForm && (
        <PoetForm
          poet={editingPoet}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadPoets();
          }}
        />
      )}

      {/* DELETE CONFIRM */}
      {deletePoet && (
        <ConfirmDelete
          title={`Delete ${deletePoet.name}?`}
          onCancel={() => setDeletePoet(null)}
          onConfirm={async () => {
            await adminService.deletePoet(deletePoet._id);
            setDeletePoet(null);
            loadPoets();
          }}
        />
      )}
    </div>
  );
};

export default AdminPoets;
