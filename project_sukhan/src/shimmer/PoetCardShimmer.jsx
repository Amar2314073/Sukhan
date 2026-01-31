const PoetCardShimmer = () => {
  return (
    <div className="min-w-[240px] rounded-2xl bg-base-200 p-6 animate-pulse text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-base-300/70 mb-4" />
      <div className="h-4 bg-base-300/70 rounded w-3/4 mx-auto mb-2" />
      <div className="h-3 bg-base-300/70 rounded w-1/2 mx-auto mb-2" />
      <div className="h-2 bg-base-300/70 rounded w-1/3 mx-auto" />
    </div>
  );
};

export default PoetCardShimmer;
