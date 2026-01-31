const CollectionCardShimmer = ({ width = 320 }) => {
  return (
    <div
      style={{ minWidth: width, maxWidth: width }}
      className="
        rounded-2xl
        bg-base-200/60
        border border-base-300/40
        overflow-hidden
        shadow-[0_10px_30px_rgba(0,0,0,0.35)]
      "
    >
      {/* IMAGE AREA */}
      <div className="h-44 bg-base-300 relative overflow-hidden">
        <div className="absolute inset-0 shimmer-line" />
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <div className="h-5 w-3/4 rounded shimmer-line" />

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded shimmer-line" />
          <div className="h-4 w-5/6 rounded shimmer-line" />
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-3">
          <div className="h-3 w-20 rounded shimmer-line" />
          <div className="h-3 w-16 rounded shimmer-line" />
        </div>
      </div>
    </div>
  );
};

export default CollectionCardShimmer;
