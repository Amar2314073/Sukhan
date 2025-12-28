import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPoemById, clearCurrentPoem } from '../redux/slices/poemSlice';
import ChatAI from '../components/ChatAI';
import { BookOpen, Volume2, VolumeX, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosClient from '../utils/axiosClient';
import { toggleZenMode } from '../redux/slices/uiSlice';

const PoemDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentPoem, loading, error } = useSelector(
    state => state.poems
  );

  const [lang, setLang] = useState('hindi');
  const [speaking, setSpeaking] = useState(false);
  const zenMode = useSelector(state => state.ui.zenMode);

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


  /* ================= STOP ON ZEN MODE TOGGLE ================= */
  useEffect(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    toast.dismiss('speaking');
  }, [zenMode]);



  /* ================= FETCH WORD MEANING ================= */
  // const fetchWordMeaning = async (word) => {
  //   try {
  //     const response = await axiosClient.post('/ai/wordMeaning', {
  //       poemText: currentPoem.content?.[lang] || '',
  //       word
  //     });
  //     console.log("Word Meaning Response:", response);
  //     return response.data.meaning;
  //   } catch (err) {
  //     console.error("🔥 Word Meaning Error:", err);
  //     return "अर्थ स्पष्ट नहीं";
  //   }
  // };

  // useEffect(() => {
  //   if (currentPoem?.content?.[lang]) {
  //     fetchWordMeaning('वक़्त');
  //   }
  // }, [currentPoem, lang]);


  const getClickedWord = () => {
    const selection = window.getSelection();
    console.log('Selection object:', selection);
    const word = selection.toString().trim();

    if (!word) return;

    console.log('Clicked word:', word);
    // yahin tum API / toast / modal call kar sakte ho
  };





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
    <div
      className={`
        min-h-screen text-base-content transition-all duration-900 ease-in-out
        ${zenMode
          ? 'bg-gray-950 text-gray-100'
          : 'bg-base-100'}
      `}
    >
      <div className={`max-w-3xl mx-auto px-4
        ${zenMode ? 'py-1 md:py-2' : 'py-5 md:py-8'}`}>

        {/* ================= TITLE + LISTEN BUTTON ================= */}
        <div
          className={`
            text-center
            transition-all duration-900 ease-in-out
            ${zenMode ? 'mb-0' : 'mb-4'}
          `}
        >

          <h1
            className={`
              text-xl md:text-2xl font-serif
              transition-all duration-900 ease-in-out
              ${zenMode
                ? 'opacity-0 translate-y-2 pointer-events-none'
                : 'opacity-100 translate-y-0'}
            `}
          >
            {currentPoem.title}
          </h1>

          {/* BUTTONS */}
          <div
            className={`
              flex justify-center gap-3 flex-wrap
              transition-all duration-900 ease-in-out
              ${zenMode ? 'mt-1' : 'mt-3'}
            `}
          >

            {/* 🔊 LISTEN BUTTON */}
            <button
              onClick={() => speakPoem(content)}
              className={`
                flex items-center gap-2
                px-5 py-2
                rounded-full
                border
                text-sm font-medium
                transition
                min-w-[140px] justify-center
                ${speaking
                  ? 'bg-error text-error-content border-error'
                  : 'bg-base-200 text-base-content hover:bg-base-300'}
              `}
            >
              {speaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
              <span>{speaking ? 'Stop' : 'Listen'}</span>
            </button>

            {/* 🧘 ZEN MODE BUTTON */}
            <button
              onClick={() => dispatch(toggleZenMode())} 
              className={`
                flex items-center gap-2
                px-5 py-2
                rounded-full
                border
                text-sm font-medium
                transition
                min-w-[140px] justify-center
                ${zenMode
                  ? 'bg-gray-900 text-gray-100 border-gray-700 hover:bg-gray-800'
                  : 'bg-base-200 text-base-content hover:bg-base-300'}
              `}
            >
              {zenMode ? <X size={18} /> : <BookOpen size={18} />}
              <span>{zenMode ? 'Exit Zen' : 'Zen Mode'}</span>
            </button>

          </div>

        </div>

        {/* ================= POET ================= */}
        {currentPoem.poet && (
          <p
            className={`
              text-center text-base-content/60
              transition-all duration-900 ease-in-out overflow-hidden
              ${zenMode
                ? 'opacity-0 max-h-0 mb-0'
                : 'opacity-100 max-h-20 mb-6'}
            `}
          >
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
        <div
          className={`
            flex justify-center gap-2
            transition-all duration-900 ease-in-out overflow-hidden
            ${zenMode
              ? 'opacity-0 max-h-0 mb-0'
              : 'opacity-100 max-h-20 mb-8'}
          `}
        >
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
        <div
          className={`
            relative rounded-2xl px-6 md:px-12
            transition-all duration-700 ease-in-out
            ${zenMode
              ? 'py-4 md:py-6 mt-2 bg-transparent shadow-none'
              : 'py-8 md:py-12 mt-0 bg-base-200/70 shadow-lg'}
          `}
        >

          <pre
            onClick={getClickedWord}
            className={`
              whitespace-pre-wrap font-serif transition-all duration-1000 ease-in-out
              ${zenMode
                ? 'text-lg md:text-xl leading-loose'
                : 'text-sm leading-relaxed'}
              ${lang === 'urdu'
                ? 'text-right font-rekhta text-md leading-loose'
                : 'text-center text-sm'}
            `}
          >
            {content}
          </pre>

        </div>

        {/* ================= AI WORD MEANING ================= */}
        <div
          className={`
            transition-all duration-900 ease-in-out
            ${zenMode
              ? 'opacity-0 translate-y-2 pointer-events-none max-h-0 overflow-hidden'
              : 'opacity-100 translate-y-0 max-h-[1000px]'}
          `}
        >
          <ChatAI poem={currentPoem} />
        </div>


      </div>
    </div>
  );
};

export default PoemDetail;
