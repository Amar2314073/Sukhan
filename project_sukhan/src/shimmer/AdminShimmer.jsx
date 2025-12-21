const AdminShimmer = () => {
  return (
    <div className="min-h-screen bg-base-100 flex justify-center">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-10 py-10">

        {/* Title */}
        <div className="h-10 w-56 mx-auto mb-12 rounded-xl shimmer-card" />

        {/* Stats shimmer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-2xl shimmer-card" />
          ))}
        </div>

        {/* Action shimmer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="h-36 rounded-2xl shimmer-card" />
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminShimmer;
