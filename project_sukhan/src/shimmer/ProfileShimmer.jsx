const ProfileShimmer = () => {
  return (
    <div className="min-h-screen bg-base-100 px-4 py-6 animate-pulse">

      {/* ===== USER CARD SHIMMER ===== */}
      <div className="bg-base-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-base-300 shimmer-card" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-40 bg-base-300 rounded shimmer-card" />
            <div className="h-4 w-56 bg-base-300 rounded shimmer-card" />
          </div>
        </div>
      </div>

      {/* ===== MY ACTIVITY SHIMMER ===== */}
      <div className="bg-base-200 rounded-2xl p-5 mb-6">
        <div className="h-5 w-32 bg-base-300 rounded shimmer-card mb-6" />

        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-base-300/40 rounded-xl p-4 space-y-3"
            >
              <div className="h-4 w-6 mx-auto bg-base-300 rounded shimmer-card" />
              <div className="h-5 w-12 mx-auto bg-base-300 rounded shimmer-card" />
              <div className="h-3 w-16 mx-auto bg-base-300 rounded shimmer-card" />
            </div>
          ))}
        </div>
      </div>

      {/* ===== SETTINGS SHIMMER ===== */}
      <div className="bg-base-200 rounded-2xl divide-y divide-base-300">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-base-300 rounded shimmer-card" />
              <div className="h-4 w-32 bg-base-300 rounded shimmer-card" />
            </div>
            <div className="h-4 w-8 bg-base-300 rounded shimmer-card" />
          </div>
        ))}
      </div>

    </div>
  );
};

export default ProfileShimmer;
