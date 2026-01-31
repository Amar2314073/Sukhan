const PoemCardShimmer = ({ width = 320, lines = 3 }) => {
  return (
    <div
      className="rounded-2xl bg-base-200 p-6 space-y-3 animate-pulse"
      style={{ minWidth: width, maxWidth: width }}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-base-300/70 rounded"
          style={{ width: `${90 - i * 10}%` }}
        />
      ))}

      <div className="flex items-center gap-3 pt-4">
        <div className="w-8 h-8 rounded-full bg-base-300/70" />
        <div className="h-3 w-24 bg-base-300/70 rounded" />
      </div>
    </div>
  );
};

export default PoemCardShimmer;
