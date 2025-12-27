import { useEffect, useRef, useState } from 'react';
import axiosClient from '../utils/axiosClient';

const ChatAI = ({ poem }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Ask meaning of any word from this poem...'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /* ================= RESET CHAT ON POEM CHANGE ================= */
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: 'Ask meaning of any word from this poem...'
      }
    ]);
    setInput('');
    setLoading(false);
  }, [poem?._id]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input.trim()
    };

    const updatedMessages = [...messages, userMessage];

    // Optimistic UI
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axiosClient.post('/ai/poemChat', {
        poemId: poem._id,
        messages: updatedMessages
      });

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: res.data.message
        }
      ]);
    } catch (err) {
      console.error('AI Chat Error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I could not respond. Please try asking about the poem again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ENTER TO SEND ================= */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="mt-16 border-t border-base-300/40 pt-10">

      {/* ================= CHAT WINDOW ================= */}
      <div className="space-y-4 max-h-[50vh] overflow-y-auto mb-6 pr-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`
                max-w-[85%] md:max-w-[70%]
                px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-primary text-primary-content'
                  : 'bg-base-200 text-base-content'}
              `}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Thinking bubble */}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl bg-base-200 text-sm italic">
              Thinking…
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ================= INPUT BAR ================= */}
      <div className="relative max-w-3xl mx-auto">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask meaning of any word from this poem..."
          className="
            w-full resize-none
            px-6 py-4 rounded-full
            bg-base-200/70
            border border-base-300/40
            text-base-content
            placeholder:text-base-content/40
            focus:outline-none
            focus:ring-2 focus:ring-primary/40
            pr-16
          "
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            bg-primary text-primary-content
            px-5 py-2 rounded-full
            hover:bg-primary/90
            disabled:opacity-60
            transition
          "
        >
          Ask
        </button>
      </div>

      <p className="text-center text-xs text-base-content/50 mt-3">
        Sukhan AI is strictly limited to this poem
      </p>
    </div>
  );
};

export default ChatAI;
