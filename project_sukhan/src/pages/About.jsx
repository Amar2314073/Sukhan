const About = () => {
  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <div className="max-w-4xl mx-auto px-4 py-20">

        {/* HERO */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold mb-4">
            What is <span className="text-primary">Sukhan</span>?
          </h1>
          <p className="text-base-content/60 italic max-w-2xl mx-auto">
            Where words are not written — they are felt.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-base-100/70 backdrop-blur
                        border border-base-300/40
                        rounded-3xl p-10 space-y-10">

          {/* SECTION 1 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold">
              Meaning of Sukhan
            </h2>
            <p className="text-base leading-relaxed text-base-content/80">
              <strong>Sukhan</strong> (سخن) is an Urdu word that signifies
              <em> speech, expression, or words filled with meaning</em>.
              In classical Urdu and Persian literature, sukhan is not merely language —
              it is the art of saying what the heart cannot hold.
            </p>
          </div>

          {/* DIVIDER */}
          <div className="h-px bg-base-300/40" />

          {/* SECTION 2 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold">
              Sukhan as a Platform
            </h2>
            <p className="text-base leading-relaxed text-base-content/80">
              <strong>Sukhan</strong> is a modern poetry platform dedicated to
              preserving and presenting Urdu and Hindi poetry.
              From timeless ghazals to contemporary free verse,
              Sukhan bridges generations through words.
            </p>
          </div>

          {/* DIVIDER */}
          <div className="h-px bg-base-300/40" />

          {/* SECTION 3 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold">
              Why the Name “Sukhan”?
            </h2>
            <p className="text-base leading-relaxed text-base-content/80">
              The idea behind naming this platform <strong>Sukhan</strong> is simple —
              words matter, silence speaks, and poetry connects souls.
              It is a space for what remains unsaid, yet deeply understood.
            </p>
          </div>

          {/* DIVIDER */}
          <div className="h-px bg-base-300/40" />

          {/* SECTION 4 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold">
              What You’ll Find Here
            </h2>
            <p className="text-base leading-relaxed text-base-content/80">
              On Sukhan, readers can explore poetry by legendary poets,
              discover new voices, and experience literature
              across eras, languages, and emotions.
            </p>
          </div>

        </div>

        {/* FOOTNOTE */}
        <p className="text-center text-sm text-base-content/50 mt-14 italic">
          Sukhan is not just a platform — it is a conversation between hearts.
        </p>

      </div>
    </div>
  );
};

export default About;
