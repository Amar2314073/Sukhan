import { useEffect, useRef } from "react";

const ConfirmModal = ({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "error",
  loading = false,
  disableCancel = false
}) => {

  const confirmRef = useRef(null);

  /* ========= Auto Focus Confirm Button ========= */
  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  /* ========= ESC Key Close ========= */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !disableCancel) {
        onCancel?.();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCancel, disableCancel]);

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-base-content/30 backdrop-blur-sm
        flex items-center justify-center px-4
      "
      onClick={!disableCancel ? onCancel : undefined}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-base-200
          border border-base-300/40
          rounded-2xl
          w-full max-w-sm
          p-6
          shadow-xl
        "
      >
        {title && (
          <h3 className="text-lg font-semibold text-base-content mb-2">
            {title}
          </h3>
        )}

        {message && (
          <p className="text-base-content/70 mb-6 leading-relaxed">
            {message}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={disableCancel}
            className="btn btn-ghost"
          >
            {cancelText}
          </button>

          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={loading}
            className={`btn btn-${variant}`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
