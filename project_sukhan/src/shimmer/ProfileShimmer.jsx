const ProfileShimmer = () => {
  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* ================= HEADER SHIMMER ================= */}
        <div className="bg-base-200 rounded-2xl p-8 mb-10">
          <div className="flex flex-col md:flex-row gap-6 items-center">

            {/* avatar */}
            <div className="w-24 h-24 rounded-full shimmer-card" />

            {/* name + email + bio */}
            <div className="flex-1 space-y-3 w-full">
              <div className="h-7 w-56 rounded shimmer-card" />
              <div className="h-4 w-72 rounded shimmer-card" />
              <div className="h-4 w-full max-w-xl rounded shimmer-card" />
            </div>

          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ================= SIDEBAR SHIMMER ================= */}
          <aside className="lg:w-1/4">
            <div className="bg-base-200 rounded-2xl p-6 space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 w-40 rounded shimmer-card" />
              ))}
            </div>
          </aside>

          {/* ================= MAIN CONTENT SHIMMER ================= */}
          <main className="lg:w-3/4 space-y-8">

            {/* Overview card */}
            <div className="bg-base-200 rounded-2xl p-8">
              <div className="h-6 w-48 rounded shimmer-card mb-6" />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-base-100 rounded-xl p-6 text-center space-y-3"
                  >
                    <div className="h-8 w-20 mx-auto rounded shimmer-card" />
                    <div className="h-4 w-24 mx-auto rounded shimmer-card" />
                  </div>
                ))}
              </div>

              <div className="h-10 w-36 rounded-xl shimmer-card" />
            </div>

            {/* Favorites shimmer list */}
            {/* <div className="bg-base-200 rounded-2xl p-8">
              <div className="h-6 w-40 rounded shimmer-card mb-6" />

              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border-b pb-3 space-y-2">
                    <div className="h-4 w-full rounded shimmer-card" />
                    <div className="h-3 w-32 rounded shimmer-card" />
                  </div>
                ))}
              </div>
            </div> */}

          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfileShimmer;
