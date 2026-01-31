const PoetCardShimmer = ({ width = 240 }) => {
  return (
    <div
      style={{ minWidth: width, maxWidth: width }}
      className="
        bg-base-200
        border border-base-300/40
        rounded-2xl
        p-6
        text-center
        shadow-[0_10px_30px_rgba(0,0,0,0.45)]
        space-y-3
      "
    >
      {/* Avatar */}
      <div className="w-20 h-20 mx-auto rounded-full shimmer-avatar mb-4" />

      {/* Poet name */}
      <div className="h-4 w-3/4 mx-auto rounded shimmer-line" />

      {/* Era */}
      <div className="h-3 w-1/2 mx-auto rounded shimmer-line" />

      {/* Country */}
      <div className="h-2 w-1/3 mx-auto rounded shimmer-line" />
    </div>
  );
};

export default PoetCardShimmer;
