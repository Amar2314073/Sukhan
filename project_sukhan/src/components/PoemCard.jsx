import { Link } from "react-router";

const PoemCard = ({ poem }) => {
  const misre =
    poem.content?.hindi
      ?.split("\n")
      .filter(Boolean)
      .slice(0, 2) || [];

  return (
    <Link
      to={`/poems/${poem._id}`}
      className="
        relative block rounded-2xl
        px-7 py-6
        bg-base-200/40
        border border-base-300/40
        hover:bg-base-200/60
        transition
      "
    >
      {/* light sweep */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-r
          from-transparent via-white/5 to-transparent
          opacity-0 hover:opacity-100
        "
      />

      {/* poem lines */}
      <div className="space-y-1">
        {misre.map((line, i) => (
          <p
            key={i}
            className="
              font-serif
              text-lg
              leading-relaxed
              text-base-content
            "
          >
            {line}
          </p>
        ))}
      </div>

      {/* poet */}
      {poem.poet && (
        <div className="mt-4 text-sm text-base-content/60">
          — by{" "}
          <Link
            to={`/poets/${poem.poet._id}`}
            onClick={e => e.stopPropagation()}
            className="hover:text-primary underline-offset-2 hover:underline"
          >
            {poem.poet.name}
          </Link>
        </div>
      )}
    </Link>
  );
};

export default PoemCard;
