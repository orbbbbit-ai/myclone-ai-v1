import { useEffect, useRef, useState } from 'react';

import { useTheme } from '../context/theme-context';

type MessageRole = 'ai' | 'user';

interface Message {
  role: MessageRole;
  text: string;
  delay: number;
}

const MESSAGES: Message[] = [
  { role: 'ai',   text: "Hey 😄 What are you looking to build?",           delay: 800  },
  { role: 'user', text: "A fintech mobile app",                             delay: 1800 },
  { role: 'ai',   text: "Nice 👀 What's your timeline and budget range?",   delay: 1800 },
  { role: 'user', text: "About 3 months — budget around $6–8k",             delay: 2000 },
  { role: 'ai',   text: "Love it. Have you validated with real users yet?", delay: 1800 },
  { role: 'user', text: "Not yet, starting from scratch",                   delay: 1800 },
  { role: 'ai',   text: "Perfect — let's map your core flows first 🎯",    delay: 1800 },
];

const RESTART_DELAY = 2800;

export function ChatPreview() {
  const { isDark } = useTheme();
  const [visibleCount, setVisibleCount] = useState(0);
  const [showTyping, setShowTyping]     = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [visibleCount, showTyping]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setVisibleCount(0);
      setShowTyping(false);
      await sleep(600);

      for (let i = 0; i < MESSAGES.length; i++) {
        if (cancelled) return;
        if (MESSAGES[i].role === 'ai') {
          setShowTyping(true);
          await sleep(MESSAGES[i].delay);
          if (cancelled) return;
          setShowTyping(false);
          await sleep(60);
        } else {
          await sleep(MESSAGES[i].delay);
        }
        if (cancelled) return;
        setVisibleCount(i + 1);
      }
      await sleep(RESTART_DELAY);
      if (!cancelled) run();
    };

    run();
    return () => { cancelled = true; };
  }, []);

  const cardBg   = isDark ? '#1a1a24' : '#ffffff';
  const cardBorder = isDark ? '1px solid #2a2a38' : 'none';
  const aiBubble = isDark ? '#23233a' : '#f8f9fa';
  const aiText   = isDark ? '#d0d0e8' : '#1e293b';
  const footerBorder = isDark ? '1px solid #22223a' : '1px solid #f1f1f1';
  const hintColor = isDark ? '#4a4a70' : '#94a3b8';

  return (
    <div
      className="max-w-lg mx-auto rounded-2xl text-left overflow-hidden transition-colors duration-300"
      style={{
        background: cardBg,
        border: cardBorder,
        boxShadow: isDark ? '0 4px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)',
      }}
    >
      <div
        ref={scrollRef}
        className="p-6 space-y-4 overflow-y-auto"
        style={{ height: '260px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          @keyframes msgIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes blink {
            0%, 80%, 100% { opacity: 0.2; }
            40%            { opacity: 1; }
          }
          .msg-appear { animation: msgIn 0.32s cubic-bezier(0.22, 1, 0.36, 1) both; }
          .dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #94a3b8; animation: blink 1.2s infinite; }
          .dot:nth-child(2) { animation-delay: 0.2s; }
          .dot:nth-child(3) { animation-delay: 0.4s; }
        `}</style>

        {MESSAGES.slice(0, visibleCount).map((msg, i) =>
          msg.role === 'ai' ? (
            <div key={i} className="flex gap-3 msg-appear">
              <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                <img src={logoImage} alt="AI" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div
                  className="rounded-2xl rounded-tl-sm px-4 py-3 inline-block max-w-[85%]"
                  style={{ background: aiBubble }}
                >
                  <p className="text-sm" style={{ color: aiText }}>{msg.text}</p>
                </div>
              </div>
            </div>
          ) : (
            <div key={i} className="flex gap-3 justify-end msg-appear">
              <div
                className="rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]"
                style={{ background: 'linear-gradient(135deg, #5b6ef5 0%, #6c63ff 50%, #7b74ff 100%)' }}
              >
                <p className="text-white text-sm">{msg.text}</p>
              </div>
            </div>
          )
        )}

        {showTyping && (
          <div className="flex gap-3 msg-appear">
            <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
              <img src={logoImage} alt="AI" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div
                className="rounded-2xl rounded-tl-sm px-4 py-3 inline-flex items-center gap-1.5"
                style={{ background: aiBubble }}
              >
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-3 text-center" style={{ borderTop: footerBorder }}>
        <p className="text-xs" style={{ color: hintColor }}>Click above to start the conversation</p>
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}
