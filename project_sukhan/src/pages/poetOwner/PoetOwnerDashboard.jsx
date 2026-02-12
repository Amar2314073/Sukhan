import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { poetOwnerService } from "@/services/poetOwner.service";
import { toast } from "react-hot-toast";
import PoetOwnerPoetProfile from "./PoetOwnerPoetProfile";
import PoetOwnerPoems from "./PoetOwnerPoems";

const PoetOwnerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  console.log(user.ownedPoet);

  const [poet, setPoet] = useState(null);
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOwnerData = async () => {
      try {
        const poetId = user?.ownedPoet;

        if (!poetId) {
          toast.error("No poet ownership found");
          return;
        }

        // fetch poet
        const poetRes = await poetOwnerService.getMyPoet(poetId);
        setPoet(poetRes.data.poet);

        // fetch poems
        const poemsRes = await poetOwnerService.getMyPoems(poetId);
        setPoems(poemsRes.data.poems);

      } catch (err) {
        toast.error("Failed to load poet data");
      } finally {
        setLoading(false);
      }
    };

    loadOwnerData();
  }, [user]);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-base-100 px-6 py-10">
      <h1 className="text-3xl text-center font-serif text-base-content mb-8">
        Poet Dashboard
      </h1>

      <PoetOwnerPoetProfile poet={poet} setPoet={setPoet} />
      <PoetOwnerPoems poems={poems} setPoems={setPoems} />
    </div>
  );
};

export default PoetOwnerDashboard;
