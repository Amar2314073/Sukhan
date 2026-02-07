const ConfirmDelete = ({ title, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-base-100 p-6 rounded-xl w-[400px]">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="btn">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-error">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
