const About = () => {
  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <div className="max-w-4xl mx-auto px-4 py-20">

        {/* HERO */}
        <div className="text-center mb-20 space-y-6">
          <h1 className="text-5xl font-serif font-bold tracking-wide">
            What is <span className="text-primary">Sukhan</span>?
          </h1>

          <p className="text-lg text-base-content/60 italic max-w-2xl mx-auto">
            A digital space where language meets silence,
            and poetry finds a contemporary home.
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
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold">
              Sukhan as a Digital Platform
            </h2>

            <p className="leading-relaxed text-base-content/80">
              Sukhan is a structured literary platform
              built to archive and present Urdu and Hindi poetry
              in a clean, searchable, and modern interface.
            </p>

            <p className="leading-relaxed text-base-content/80">
              It combines classical literature with contemporary technology —
              enabling readers to explore poets, collections,
              and literary eras in an organized digital environment.
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
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold">
              Expression Beyond Words
            </h2>

            <p className="leading-relaxed text-base-content/80">
              Poetry does not always reside in speech.
              At times, silence itself becomes articulation.
            </p>

            <div className="bg-base-200/60 border border-base-300/40 rounded-2xl p-6">
              <p className="font-serif text-lg leading-relaxed">
                “कभी तो बात भी ख़फ़ी,
                कभी सुकूत भी सुख़न”
              </p>
              <p className="text-sm text-base-content/60 mt-3">
                — Ahmad Faraz
              </p>
            </div>

            <p className="text-base-content/70 leading-relaxed">
              As Ahmad Faraz reflects,
              sometimes meaning lies hidden in speech,
              and sometimes silence itself becomes sukhan.
              This duality defines the literary spirit Sukhan seeks to present.
            </p>
          </div>


          {/* DIVIDER */}
          <div className="h-px bg-base-300/40" />

          {/* SECTION 5 */}
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

          <div className="mt-20 text-center bg-base-200/60 
                border border-base-300/40 
                rounded-3xl p-10">

            <p className="font-serif text-xl leading-relaxed">
              Sukhan is not merely poetry —
              it is the space between thought and expression.
            </p>

            <p className="mt-6 text-sm text-base-content/60 italic">
              A curated home for language, literature, and individuality.
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
