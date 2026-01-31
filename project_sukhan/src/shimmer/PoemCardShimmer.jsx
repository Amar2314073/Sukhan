const PoemCardShimmer = ({ width = 320, lines = 3 }) => {
  return (
    <div
      style={{ minWidth: width, maxWidth: width }}
      className="
        bg-base-200
        border border-base-300/40
        rounded-2xl
        p-6
        space-y-4
        shadow-[0_10px_30px_rgba(0,0,0,0.45)]
      "
    >
      {/* Title */}
      <div className="h-5 w-3/4 rounded shimmer-line" />

      {/* Content lines */}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded shimmer-line"
            style={{ width: `${90 - i * 12}%` }}
          />
        ))}
      </div>

      {/* Poet */}
      <div className="flex items-center gap-3 pt-4">
        <div className="w-9 h-9 rounded-full shimmer-avatar" />
        <div className="h-3 w-24 rounded shimmer-line" />
      </div>
    </div>
  );
};

export default PoemCardShimmer;
