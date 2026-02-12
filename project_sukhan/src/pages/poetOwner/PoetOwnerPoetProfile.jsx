import { useState } from "react";
import PoetOwnerPoetForm from "@/components/poetOwner/PoetOwnerPoetForm";

const PoetOwnerPoetProfile = ({ poet, setPoet }) => {
  const [editing, setEditing] = useState(false);

  if (!poet) return null;

  return (
    <>
      <div className="
        bg-base-200/70
        border border-base-300/40
        rounded-2xl
        p-6
        shadow-sm
        mb-10
      ">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <img
              src={poet.image || "/poet-placeholder.png"}
              alt={poet.name}
              className="
                w-20 h-20
                rounded-full
                object-cover
                border border-base-300
              "
            />

            <div>
              <h2 className="text-2xl font-serif font-semibold text-base-content">
                {poet.name}
              </h2>
              <p className="text-sm text-base-content/60">
                {poet.era} Poet · {poet.country}
              </p>
            </div>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="
              px-4 py-2
              rounded-xl
              border border-primary/40
              text-primary
              hover:bg-primary/10
              transition
              text-sm
              font-medium
              shrink-0
            "
          >
            Edit Profile
          </button>
        </div>

        {/* BIO */}
        <div className="text-sm leading-relaxed text-base-content/80 mb-4">
          {poet.bio}
        </div>

        {/* META */}
        <div className="flex flex-wrap gap-6 text-sm text-base-content/70">
          {poet.birthYear && (
            <div>
              <span className="font-medium text-base-content">
                Born:
              </span>{" "}
              {poet.birthYear}
              {poet.deathYear ? ` – ${poet.deathYear}` : ""}
            </div>
          )}

          {poet.country && (
            <div>
              <span className="font-medium text-base-content">
                Country:
              </span>{" "}
              {poet.country}
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <PoetOwnerPoetForm
          poet={poet}
          onClose={() => setEditing(false)}
          onSuccess={(updatedPoet) => {
            setPoet(updatedPoet);
            setEditing(false);
          }}
        />
      )}
    </>
  );
};

export default PoetOwnerPoetProfile;
