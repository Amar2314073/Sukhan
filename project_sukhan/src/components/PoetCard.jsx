import { Link } from 'react-router';
import { useNavigate } from 'react-router';

const PoetCard = ({ poet }) => {
    const navigate = useNavigate();
    return (
        <div
        onClick={() => navigate(`/poets/${poet._id}`)}
        className="
            group
            block
            bg-base-200/70
            border border-base-300/40
            rounded-2xl
            p-5
            text-center
            transition
            hover:bg-base-200
            hover:shadow-lg
        "
        >
        {/* ================= IMAGE ================= */}
        <div className="flex justify-center mb-4">
            <div
            className="
                w-20 h-20
                rounded-full
                overflow-hidden
                bg-base-300
                ring-2 ring-base-300/50
                group-hover:ring-primary/60
                transition
            "
            >
            <img
                src={poet.image || '/poet-placeholder.png'}
                alt={poet.name}
                className="w-full h-full object-cover"
            />
            </div>
        </div>

        {/* ================= NAME ================= */}
        <h3
            className="
            font-serif
            text-sm
            font-semibold
            text-base-content
            leading-snug
            whitespace-nowrap
            overflow-x-auto
            "
            style={{
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none' 
            }}
        >
            {poet.name}
        </h3>

        {/* ================= YEARS ================= */}
        {(poet.birthYear || poet.deathYear) && (
            <p className="mt-1 text-xs text-base-content/60">
            {poet.birthYear || '—'}
            {poet.deathYear ? ` – ${poet.deathYear}` : poet.birthYear ? ' – Present' : ''}
            </p>
        )}

        {/* Era if birth year is not present */}
            {!poet.birthYear && poet.era && (
                <p className="mt-1 text-xs text-base-content/60">
                    {poet.era}
                </p>
            )}
        </div>
    );
};

export default PoetCard;
