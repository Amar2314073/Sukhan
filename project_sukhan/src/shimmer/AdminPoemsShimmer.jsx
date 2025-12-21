const AdminPoemsShimmer = () => {
  return (
    <div className="min-h-screen bg-base-100 px-4 md:px-6 py-6 overflow-hidden">

      {/* ================= HEADER SHIMMER ================= */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="h-9 w-56 rounded-xl shimmer-card" />
        <div className="flex-1 h-10 rounded-xl shimmer-card" />
        <div className="h-10 w-32 rounded-xl shimmer-card" />
      </div>

      {/* ================= TABLE SHIMMER (DESKTOP) ================= */}
      <div className="hidden md:block">
        <div
          className="
            bg-base-100
            rounded-2xl
            border border-base-300/40
            shadow-[0_12px_40px_rgba(0,0,0,0.55)]
            overflow-hidden
          "
        >
          {/* table head */}
          <div className="grid grid-cols-4 gap-6 px-6 py-5 bg-base-200/40 border-b border-base-300/50">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-5 rounded shimmer-card" />
            ))}
          </div>

          {/* table rows (auto screen fill, no scroll) */}
          <div className="space-y-4 px-6 py-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="
                  grid grid-cols-4 gap-6
                  items-center
                "
              >
                <div className="h-5 rounded shimmer-card" />
                <div className="h-5 rounded shimmer-card" />
                <div className="h-5 rounded shimmer-card" />
                <div className="h-5 rounded shimmer-card ml-auto w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MOBILE CARDS SHIMMER ================= */}
      <div className="md:hidden space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="
              bg-base-100
              border border-base-300/40
              rounded-2xl
              shadow-[0_10px_30px_rgba(0,0,0,0.5)]
              p-5
              space-y-4
            "
          >
            <div className="h-6 w-3/4 rounded shimmer-card" />
            <div className="h-4 w-1/2 rounded shimmer-card" />
            <div className="h-4 w-1/3 rounded shimmer-card" />

            <div className="flex gap-6 pt-2">
              <div className="h-4 w-12 rounded shimmer-card" />
              <div className="h-4 w-12 rounded shimmer-card" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminPoemsShimmer;
