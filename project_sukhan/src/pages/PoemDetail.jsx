import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPoemById, clearCurrentPoem } from '../redux/slices/poemSlice';
import ChatAI from '../components/ChatAI';
import { Volume2, VolumeX } from 'lucide-react';
import toast from 'react-hot-toast';

const PoemDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentPoem, loading, error } = useSelector(
    state => state.poems
  );

  const [lang, setLang] = useState('hindi');
  const [speaking, setSpeaking] = useState(false);

  /* ================= TEXT TO SPEECH ================= */
  const speakPoem = (text) => {
    if (!window.speechSynthesis) {
      toast.error('Text to speech not supported');
      return;
    }

    // Stop if already speaking
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      toast.dismiss();
      toast('Reading stopped', { icon: '⏹️' });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Language detection
    if (/[\u0600-\u06FF]/.test(text)) {
      utterance.lang = 'ur-PK'; // Urdu
    } else if (/[\u0900-\u097F]/.test(text)) {
      utterance.lang = 'hi-IN'; // Hindi
    } else {
      utterance.lang = 'en-IN'; // Roman / English
    }

    utterance.rate = 0.85;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setSpeaking(true);
      toast.loading('Reading poem…', { id: 'speaking' });
    };

    utterance.onend = () => {
      setSpeaking(false);
      toast.dismiss('speaking');
      toast.success('Finished reading');
    };

    window.speechSynthesis.speak(utterance);
  };

  /* ================= FETCH POEM ================= */
  useEffect(() => {
    dispatch(fetchPoemById(id));
    return () => dispatch(clearCurrentPoem());
  }, [id, dispatch]);

  /* ================= STOP ON LANG / POEM CHANGE ================= */
  useEffect(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    toast.dismiss('speaking');
  }, [lang, currentPoem?._id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 text-center text-error">
        {error}
      </div>
    );
  }

  if (!currentPoem) return null;

  const content = currentPoem.content?.[lang];

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* ================= TITLE + LISTEN BUTTON ================= */}
        <div className="text-center mb-4 space-y-3">

          <h1 className="text-3xl md:text-4xl font-serif">
            {currentPoem.title}
          </h1>

          {/* LISTEN BUTTON */}
          <div className="flex justify-center">
            <button
              onClick={() => speakPoem(content)}
              className={`
                flex items-center gap-2
                px-5 py-2 rounded-full
                border transition
                ${speaking
                  ? 'bg-error text-error-content border-error'
                  : 'bg-base-200 text-base-content hover:bg-base-300'}
              `}
            >
              {speaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
              <span className="text-sm font-medium">
                {speaking ? 'Stop Listening' : 'Listen'}
              </span>
            </button>
          </div>
        </div>

        {/* ================= POET ================= */}
        {currentPoem.poet && (
          <p className="text-center text-base-content/60 mb-6">
            —{' '}
            <Link
              to={`/poets/${currentPoem.poet._id}`}
              className="hover:text-primary hover:underline"
            >
              {currentPoem.poet.name}
            </Link>
          </p>
        )}

        {/* ================= LANGUAGE SWITCH ================= */}
        <div className="flex justify-center gap-2 mb-8">
          {['urdu', 'hindi', 'roman'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`
                px-4 py-1.5 rounded-full text-xs font-medium
                transition border
                ${lang === l
                  ? 'bg-primary text-primary-content border-primary'
                  : 'bg-base-200 border-base-300 hover:bg-base-300'}
              `}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ================= POEM CARD ================= */}
        <div className="relative rounded-2xl px-6 md:px-10 py-8 md:py-10 bg-base-200/70 shadow-lg">

          <pre
            className={`
              whitespace-pre-wrap
              font-serif
              leading-relaxed
              ${lang === 'urdu'
                ? 'text-right font-rekhta text-md leading-loose'
                : 'text-center text-sm'}
            `}
          >
            {content}
          </pre>

        </div>

        {/* ================= AI WORD MEANING ================= */}
        <ChatAI poem={currentPoem} />

      </div>
    </div>
  );
};

export default PoemDetail;
