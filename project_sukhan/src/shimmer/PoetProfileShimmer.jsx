const PoetProfileShimmer = () => {
  return (
    <div className="bg-base-100 text-base-content animate-pulse">

      {/* ================= HERO BANNER ================= */}
      <div className="relative h-[260px] sm:h-[300px] md:h-[340px] bg-base-200">
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">

            {/* Poet Image */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full bg-base-300" />

            {/* Name + meta */}
            <div className="space-y-3 w-[260px] sm:w-[340px]">
              <div className="h-6 w-2/3 bg-base-300 rounded" />
              <div className="h-4 w-1/2 bg-base-300 rounded" />

              {/* Bio */}
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full bg-base-300 rounded" />
                <div className="h-3 w-5/6 bg-base-300 rounded" />
                <div className="h-3 w-4/6 bg-base-300 rounded" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= CATEGORY TABS ================= */}
      <div className="border-b border-base-300/40 bg-base-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-6 py-4">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="h-4 w-20 bg-base-300 rounded"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LEFT POEMS */}
        <div className="md:col-span-3 space-y-6">
          <div className="h-6 w-40 bg-base-300 rounded mb-6" />

          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="rounded-2xl bg-base-200/60 p-7 space-y-3"
            >
              <div className="h-4 w-full bg-base-300 rounded" />
              <div className="h-4 w-5/6 bg-base-300 rounded" />
            </div>
          ))}
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden md:block">
          <div className="bg-base-200/40 border border-base-300/40 rounded-2xl p-6 space-y-5">

            <div className="h-4 w-32 bg-base-300 rounded" />

            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="flex justify-between items-center"
              >
                <div className="h-3 w-24 bg-base-300 rounded" />
                <div className="h-5 w-8 bg-base-300 rounded-full" />
              </div>
            ))}

            <div className="h-3 w-20 bg-base-300 rounded mt-4" />
            <div className="h-4 w-32 bg-base-300 rounded" />

            <div className="h-3 w-20 bg-base-300 rounded mt-4" />
            <div className="h-4 w-32 bg-base-300 rounded" />
          </div>
        </aside>

      </div>
    </div>
  );
};

export default PoetProfileShimmer;
