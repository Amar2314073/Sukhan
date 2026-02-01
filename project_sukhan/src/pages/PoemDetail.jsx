import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPoemById, clearCurrentPoem } from '../redux/slices/poemSlice';
import { toggleLikePoem, toggleSavePoem } from '../redux/slices/authSlice';
import { toggleZenMode } from '../redux/slices/uiSlice';
import AutoFitMisra from '../components/AutoFitMisra';
// import ChatAI from '../components/ChatAI';
import {
  Heart,
  ThumbsUp,
  Bookmark,
  Volume2,
  VolumeX,
  BookOpen,
  X,
  ChevronDown,
  Star
} from 'lucide-react';

const BG_IMAGE =
  'https://rekhta.pc.cdn.bitgravity.com/Images/poet-profile-banner.png';

const PoemDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentPoem, loading, error } = useSelector(s => s.poems);
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const zenMode = useSelector(s => s.ui.zenMode);

  const [lang, setLang] = useState('hindi');
  const [showLang, setShowLang] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(fetchPoemById(id));
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => dispatch(clearCurrentPoem());
  }, [id, dispatch]);

  useEffect(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [lang, zenMode, currentPoem?._id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error) return <div className="p-6 text-error">{error}</div>;
  if (!currentPoem) return null;

  const content = currentPoem.content?.[lang] || '';
  const couplets = content.split('\n\n').map(s => s.trim()).filter(Boolean);

  /* ================= LIKE / SAVE ================= */
  const poemId = currentPoem?._id;

    const liked = user?.likedPoems?.some(
    pid => pid.toString() === poemId
    );

    const saved = user?.savedPoems?.some(
    pid => pid.toString() === poemId
    );


  const handleLike = () => {
    if (!isAuthenticated) {
      navigate('/register', { state: { redirectTo: `/poems/${poemId}` } });
      return;
    }
    dispatch(toggleLikePoem(poemId));
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      navigate('/register', { state: { redirectTo: `/poems/${id}` } });
      return;
    }
    dispatch(toggleSavePoem(poemId));
  };

  /* ================= TTS ================= */
  const speakPoem = () => {
    if (!window.speechSynthesis) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const u = new SpeechSynthesisUtterance(content);
    u.lang =
      lang === 'urdu' ? 'ur-PK' : lang === 'hindi' ? 'hi-IN' : 'en-IN';
    u.rate = 0.85;

    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);

    window.speechSynthesis.speak(u);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">

      {/* ================= HEADER ================= */}
      <div
        className={`
            relative px-6 overflow-hidden
            transition-all duration-700 ease-in-out
            ${zenMode
            ? 'max-h-0 opacity-0 py-0'
            : 'max-h-[260px] opacity-100 py-6'}
        `}
        style={{
            backgroundImage: !zenMode ? `url(${BG_IMAGE})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}
        >
        <div
        className={`
            absolute inset-0 bg-black/60
            transition-opacity duration-700
            ${zenMode ? 'opacity-0' : 'opacity-100'}
        `}
        />

        <div className="relative z-10 max-w-5xl mx-auto">

          {/* TOP ROW */}
          <div className="flex items-start justify-between">

            {/* LEFT */}
            <div className="flex gap-3">
              <img
                src={currentPoem?.poet?.image || 'https://www.gravatar.com/avatar/?d=mp&s=80'}
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />

              <div>
                <p className="text-xs opacity-80">
                  {currentPoem.type || 'Ghazal'} by
                </p>
                <p className="font-medium">
                  {currentPoem.poet?.name}
                </p>
              </div>
            </div>

            {/* RIGHT – LANGUAGE DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setShowLang(v => !v)}
                className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-full text-sm"
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                <ChevronDown size={14} />
              </button>

              {showLang && (
                <div className="absolute right-0 mt-2 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                  {['hindi', 'roman'].map(l => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        setShowLang(false);
                      }}
                      className="block px-4 py-2 text-sm hover:bg-gray-800 w-full text-left"
                    >
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* META */}
          <div className="mt-4 flex items-center gap-4 text-sm opacity-90">
            <div className="flex items-center gap-1">
              <Heart size={14} className="text-red-400" />
              {currentPoem.likes || 0}
            </div>

            {currentPoem.popular && (
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={14} fill="currentColor" /> Popular
              </div>
            )}
          </div>

          {/* TITLE */}
          <h1 className="mt-4 text-2xl md:text-3xl font-serif leading-snug">
            {currentPoem.title}
          </h1>

        </div>
      </div>

      {/* ================= POEM ================= */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="rounded-2xl bg-gray-900/60 px-6 md:px-10 py-8 md:py-10">
          {couplets.map((sher, i) => (
            <div key={i} className="mb-10">
              {sher.split('\n').map((misra, j) => (
                <AutoFitMisra key={j} text={misra} lang={lang} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ================= ACTION BAR ================= */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex gap-6 bg-gray-900/90 px-8 py-4 rounded-full shadow-lg">
          <button onClick={handleLike}>
            <ThumbsUp
                size={26}
                className={`
                    transition
                    ${liked
                    ? 'fill-blue-800 text-blue-700'
                    : 'text-gray-400 hover:text-blue-400'}
                `}
            />
          </button>

          <button onClick={handleSave}>
            <Bookmark
                size={26}
                className={`
                    transition
                    ${saved
                    ? 'fill-white text-white'
                    : 'text-gray-400 hover:text-white'}
                `}
            />

          </button>

          <button onClick={speakPoem}>
            {speaking ? <VolumeX size={26} /> : <Volume2 size={26} />}
          </button>

          <button onClick={() => dispatch(toggleZenMode())}>
            {zenMode ? <X size={26} /> : <BookOpen size={26} />}
          </button>
        </div>
      </div>

      {/* {!zenMode && <ChatAI poem={currentPoem} />} */}
    </div>
  );
};

export default PoemDetail;
