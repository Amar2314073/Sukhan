import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { fetchStats } from "@/redux/slices/statSlice";
import InstallSukhanButton from "@/components/InstallSukhanButton";
import { homeService } from "../services/home.service";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { statsData, loading } = useSelector((state) => state.stats);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [homeData, setHomeData] = useState(null);
  const [loadingHome, setLoadingHome] = useState(true);

  useEffect(() => {
    dispatch(fetchStats());
    fetchHome();
  }, []);

  const fetchHome = async () => {
    try {
      const data = await homeService.getHome();
      setHomeData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHome(false);
    }
  };

  if (loadingHome) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const {
    heroSher,
    todaysPick,
    featuredPoems = [],
    popularPoets = [],
    featuredCollections = []
  } = homeData || {};

  return (
    <div className="min-h-screen bg-base-100 text-base-content">

      {/* ================= HERO ================= */}
      <section className="py-24 text-center border-b border-base-300/40 bg-base-200">
        <div className="max-w-4xl mx-auto px-6 space-y-6">

          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-wide">
            Sukhan <span className="text-primary">سخن</span>
          </h1>

          <h2 className="text-xl md:text-2xl font-serif text-base-content/80">
            An Urdu & Hindi Poetry Platform
          </h2>

          <p className="text-base-content/60 italic max-w-2xl mx-auto leading-relaxed">
            Sukhan is a literary space for Urdu ghazals, nazms, shers,
            and Hindi poetry — where emotion, silence, and meaning meet.
          </p>

          <div className="pt-6 flex justify-center gap-4">
            <InstallSukhanButton />
            <Link to="/about" className="btn btn-outline">
              About Sukhan
            </Link>
          </div>

        </div>
      </section>


      <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">

        {/* ================= TODAY PICK ================= */}
        {todaysPick && (
          <section>
            <h2 className="text-2xl font-serif font-bold mb-6">
              Today’s Pick
            </h2>

            <div
              onClick={() => navigate(`/poems/${todaysPick._id}`)}
              className="bg-base-200 rounded-2xl p-10 cursor-pointer hover:scale-[1.01] transition"
            >
              <p className="font-serif text-xl whitespace-pre-line">
                {(todaysPick.content?.hindi || todaysPick.content?.english)
                  ?.split("\n")
                  .slice(0, 2)
                  .join("\n")}
              </p>
              <p className="mt-4 text-primary">
                — {todaysPick.poet?.name}
              </p>
            </div>
          </section>
        )}

        {/* ================= FEATURED POEMS ================= */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif font-bold">
              Featured Poems
            </h2>
            <Link to="/poems" className="text-primary hover:underline">
              View all
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPoems.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/poems/${p._id}`)}
                className="bg-base-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition"
              >
                <h3 className="font-serif text-lg mb-3 line-clamp-1">
                  {p.title}
                </h3>
                <p className="text-sm whitespace-pre-line line-clamp-3">
                  {(p.content?.hindi || p.content?.english)
                    ?.split("\n")
                    .slice(0, 2)
                    .join("\n")}
                </p>
                <p className="mt-3 text-sm text-primary">
                  — {p.poet?.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= POPULAR POETS ================= */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif font-bold">
              Popular Poets
            </h2>
            <Link to="/poets" className="text-primary hover:underline">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {popularPoets.map((poet) => (
              <div
                key={poet._id}
                onClick={() => navigate(`/poets/${poet._id}`)}
                className="cursor-pointer"
              >
                {poet.image && (
                  <img
                    src={poet.image}
                    alt={poet.name}
                    className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                  />
                )}
                <h3 className="font-serif">{poet.name}</h3>
                <p className="text-sm text-base-content/60">
                  {poet.era}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= COLLECTIONS ================= */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif font-bold">
              Collections
            </h2>
            <Link to="/collections" className="text-primary hover:underline">
              Browse all
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredCollections.map((col) => (
              <div
                key={col._id}
                onClick={() => navigate(`/collections/${col._id}`)}
                className="bg-base-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition"
              >
                <h3 className="font-serif text-lg mb-2">
                  {col.name}
                </h3>
                <p className="text-sm text-base-content/60 line-clamp-2">
                  {col.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="text-center">
          <h2 className="text-2xl font-serif font-bold mb-10">
            Sukhan in Numbers
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-10">
            <Stat label="Poems" value={loading ? "—" : `${statsData?.poems-statsData?.poems%100}+`} />
            <Stat label="Poets" value={loading ? "—" : statsData?.poets-statsData?.poets%100 ?`${statsData?.poets-statsData?.poets%100}+` : '100+'} />
          </div>
        </section>
      </div>

      {/* ================= FOOTER CTA ================= */}
      <section className="bg-base-200 py-20 text-center">
        {!isAuthenticated ? (
          <>
            <h2 className="text-3xl font-serif font-bold mb-4">
              Begin Your Journey
            </h2>
            <Link to="/register" className="btn btn-primary">
              Create Account
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-serif mb-4">
              Continue your reading journey
            </h2>
            <Link to="/poems" className="btn btn-primary">
              Explore Poems
            </Link>
          </>
        )}
      </section>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <p className="text-4xl font-serif text-primary font-bold">
      {value}
    </p>
    <p className="text-base-content/60 mt-2">
      {label}
    </p>
  </div>
);

export default Home;
