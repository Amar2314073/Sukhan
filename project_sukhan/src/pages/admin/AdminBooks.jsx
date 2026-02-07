import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../../utils/axiosClient";
import { adminService } from "../../services/admin.service";
import toast from "react-hot-toast";
import ConfirmDelete from "../../components/ConfirmDelete";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmBook, setConfirmBook] = useState(null);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const res = await axiosClient.get("/books");
      setBooks(res.data.books || []);
    } catch (err) {
      toast.error("Failed to load books");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  /* ================= OPEN CONFIRM ================= */
  const openDeleteConfirm = (book) => {
    setConfirmBook(book);
  };

  /* ================= CONFIRM DELETE ================= */
  const confirmDeleteBook = async () => {
    if (!confirmBook) return;

    const toastId = toast.loading("Deleting book...");

    try {
      setDeletingId(confirmBook._id);

      await adminService.deleteBook(confirmBook._id);

      toast.success("Book deleted successfully", { id: toastId });
      setConfirmBook(null);
      fetchBooks();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Delete failed",
        { id: toastId }
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold">
          📚 Manage Books
        </h1>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/books/add")}
        >
          + Add Book
        </button>
      </div>

      {/* GRID */}
      <div
        className="
          grid gap-6
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
        "
      >
        {books.map(book => (
          <div
            key={book._id}
            className="
              bg-base-200
              rounded-xl
              overflow-hidden
              border border-base-300/40
              hover:shadow-md
              transition
            "
          >
            {/* COVER */}
            <div className="relative aspect-[2/3] bg-base-300 overflow-hidden">
              <img
                src={book.coverImage}
                alt={book.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* INFO */}
            <div className="p-3 space-y-1">
              <p className="text-sm font-semibold line-clamp-2">
                {book.title}
              </p>

              {book.author && (
                <p className="text-xs italic text-base-content/60">
                  {book.author}
                </p>
              )}

              <div className="flex flex-wrap gap-1 pt-1 text-[10px]">
                {book.category && (
                  <span className="px-2 py-0.5 rounded bg-base-300">
                    {book.category}
                  </span>
                )}

                {book.language && (
                  <span className="px-2 py-0.5 rounded bg-base-300">
                    {book.language}
                  </span>
                )}
              </div>

              <div className="flex justify-between text-xs pt-2 text-base-content/60">
                <span>Clicks: {book.clicks || 0}</span>
                {book.price && <span>₹{book.price}</span>}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex border-t border-base-300/40">
              <button
                onClick={() =>
                  navigate(`/admin/books/edit/${book._id}`)
                }
                disabled={deletingId === book._id}
                className="
                  w-1/2 py-2 text-xs
                  hover:bg-base-300
                  transition
                  disabled:opacity-50
                "
              >
                Edit
              </button>

              <button
                onClick={() => openDeleteConfirm(book)}
                disabled={deletingId === book._id}
                className="
                  w-1/2 py-2 text-xs text-error
                  hover:bg-error/10
                  transition
                  disabled:opacity-50
                "
              >
                {deletingId === book._id
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== CONFIRM DELETE MODAL ===== */}
      {confirmBook && (
        <ConfirmDelete
          title={`Delete "${confirmBook.title}" ?`}
          onCancel={() => setConfirmBook(null)}
          onConfirm={confirmDeleteBook}
        />
      )}
    </div>
  );
};

export default AdminBooks;
