import { useState } from "react";
import { FiEdit2, FiPlus } from "react-icons/fi";
import PoetOwnerPoemForm from "@/components/poetOwner/PoetOwnerPoemForm";

const PoetOwnerPoems = ({ poetId, poems, setPoems }) => {
  const [editingPoem, setEditingPoem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-base-200 border border-base-300 rounded-2xl p-6 mt-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-serif">
          My Poems <span className="text-base-content/60">({poems.length})</span>
        </h2>

        <button
          onClick={() => {
            setEditingPoem(null);
            setShowForm(true);
          }}
          className="
            flex items-center gap-2
            px-4 py-2
            rounded-xl
            bg-primary
            text-primary-content
            text-sm
            hover:opacity-90
          "
        >
          <FiPlus />
          Add Poem
        </button>
      </div>

      {/* EMPTY STATE */}
      {poems.length === 0 ? (
        <p className="text-base-content/60 italic">
          You haven’t added any poems yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {poems.map((poem) => (
            <li
              key={poem._id}
              className="
                flex justify-between items-center
                p-4 rounded-xl
                bg-base-100
                border border-base-300
              "
            >
              <span className="font-medium">
                {poem.title}
              </span>

              <button
                onClick={() => {
                  setEditingPoem(poem);
                  setShowForm(true);
                }}
                className="
                  flex items-center gap-1
                  text-sm
                  text-primary
                  hover:underline
                "
              >
                <FiEdit2 size={14} />
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* MODAL */}
      {showForm && (
        <PoetOwnerPoemForm
          poetId={poetId}
          poem={editingPoem}
          onClose={() => setShowForm(false)}
          onSuccess={(updatedPoem) => {
            if (editingPoem) {
              // update existing
              setPoems((prev) =>
                prev.map((p) =>
                  p._id === updatedPoem._id ? updatedPoem : p
                )
              );
            } else {
              // create new
              setPoems((prev) => [updatedPoem, ...prev]);
            }
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
};

export default PoetOwnerPoems;
