import { useState, useEffect, useRef } from 'react';
import { X, Send, Calendar } from 'lucide-react';

import { CaseStudyModal } from './case-study-modal';
import { useTheme } from '../context/theme-context';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ConversationState =
  | 'entry'
  | 'discovery_1'
  | 'discovery_2'
  | 'discovery_3'
  | 'depth_1'
  | 'depth_2'
  | 'budget'
  | 'pricing_anchor'
  | 'align_check'
  | 'qualified'
  | 'low_budget'
  | 'done';

type UserQuality = 'unknown' | 'qualified' | 'low';

interface PortfolioProject {
  title: string;
  description: string;
  link: string;
  image: string;
  category: string;
}

interface Message {
  id: number;
  type: 'ai' | 'user';
  text: string;
  chips?: string[];
  isBookingCard?: boolean;
  portfolioProjects?: PortfolioProject[];
}

const BUDGET_OPTIONS = ['Below ₦200k', '₦200k – ₦500k', '₦500k – ₦1M', '₦1M+'];
const ALIGN_OPTIONS = ["Yes, let's go", 'Not quite'];

const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    title: 'Fintech Mobile App',
    description: 'End-to-end UX design for a scaling fintech startup, focusing on onboarding and transaction flows.',
    link: '#',
    image: 'https://images.unsplash.com/photo-1767449280971-46e438b1ce4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW50ZWNoJTIwbW9iaWxlJTIwYXBwJTIwVUklMjBzY3JlZW58ZW58MXx8fHwxNzc0MDQ2ODE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Mobile App',
  },
  {
    title: 'SaaS Dashboard',
    description: 'Product structure and user flow optimisation for a B2B platform.',
    link: '#',
    image: 'https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYWFTJTIwZGFzaGJvYXJkJTIwYW5hbHl0aWNzJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc3Mzk1ODE3MXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'SaaS',
  },
];

const isPortfolioRequest = (text: string): boolean => {
  const lower = text.toLowerCase();
  return (
    lower.includes('portfolio') ||
    lower.includes('show me your work') ||
    lower.includes('see your work') ||
    lower.includes('past work') ||
    lower.includes('previous work') ||
    lower.includes('your work') ||
    lower.includes('what have you built') ||
    lower.includes('behance') ||
    lower.includes('dribbble') ||
    lower.includes('projects')
  );
};

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>('entry');
  const [awaitingChip, setAwaitingChip] = useState(false);
  const [userQuality, setUserQuality] = useState<UserQuality>('unknown');
  const [activeCaseStudy, setActiveCaseStudy] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addAIMessage = (
    text: string,
    chips?: string[],
    isBookingCard?: boolean,
    portfolioProjects?: PortfolioProject[]
  ) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now() + Math.random(), type: 'ai', text, chips, isBookingCard, portfolioProjects },
    ]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now() + Math.random(), type: 'user', text },
    ]);
  };

  const initConversation = () => {
    setMessages([]);
    setConversationState('entry');
    setAwaitingChip(false);
    setInputValue('');
    setIsTyping(false);
    setUserQuality('unknown');

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(
          "Hey 😄\nBefore you book a call with Adebayo, I'll quickly figure out if this is a good fit.\nWhat are you looking to build?"
        );
        setConversationState('discovery_1');
      }, 1000);
    }, 400);
  };

  useEffect(() => {
    if (isOpen) initConversation();
  }, [isOpen]);

  // --- Portfolio handler ---
  const handlePortfolioRequest = (userText: string) => {
    addUserMessage(userText);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      addAIMessage(
        "I've got a few solid projects I can show you 👀\nMost of Adebayo's work focuses on product thinking, user experience, and structure—not just visuals."
      );
      addAIMessage('Here are a couple relevant ones:', undefined, false, PORTFOLIO_PROJECTS);
      addAIMessage(
        "Curious—what you're building, is it closer to something like these or something different?"
      );
    }, 800);
  };

  const getCurrentPrompt = (): string | null => {
    const prompts: Partial<Record<ConversationState, string>> = {
      discovery_1: 'So—is this a mobile app, website, or something else?',
      discovery_2: 'What stage is it at right now?',
      discovery_3: 'Do you already have a brief, or are we starting from scratch?',
      depth_1: 'What problem is this solving? (pitch it like you\'re talking to an investor 😄)',
      depth_2: 'What timeline are you working with?',
    };
    return prompts[conversationState] ?? null;
  };

  // --- Budget selection ---
  const handleBudgetSelection = (budget: string) => {
    addUserMessage(budget);
    setAwaitingChip(false);

    const isLow = budget === 'Below ₦200k' || budget === '₦200k – ₦500k';
    setUserQuality(isLow ? 'low' : 'qualified');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      if (isLow) {
        addAIMessage(
          "I respect the honesty 🙏\nAt that range, we might struggle to get the level of thinking and structure this needs."
        );
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addAIMessage('It might be better to refine the idea or budget a bit before jumping in.');
            setConversationState('done');
          }, 1200);
        }, 800);
      } else {
        addAIMessage(
          "Got it… this is interesting 👀\nFor projects like this, Adebayo typically works within ₦500k – ₦4M depending on scope and depth."
        );
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addAIMessage('Does that align with what you had in mind?', ALIGN_OPTIONS);
            setAwaitingChip(true);
            setConversationState('align_check');
          }, 1200);
        }, 900);
      }
    }, 1000);
  };

  // --- Align response ---
  const handleAlignResponse = (answer: string) => {
    addUserMessage(answer);
    setAwaitingChip(false);

    const isYes = answer.toLowerCase().includes('yes') || answer.toLowerCase().includes('go');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      if (isYes) {
        addAIMessage('Nice. This actually sounds like something worth diving into properly.');
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addAIMessage('', undefined, true);
            setConversationState('done');
          }, 1000);
        }, 800);
      } else {
        addAIMessage(
          'That makes sense. Good product design usually involves more depth than most people expect.'
        );
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addAIMessage("If the scope or budget shifts, I'm here. You can always come back 👋");
            setConversationState('done');
          }, 1200);
        }, 900);
      }
    }, 1000);
  };

  // --- Main send handler ---
  const handleSend = () => {
    if (!inputValue.trim() || isTyping || awaitingChip || conversationState === 'done') return;
    const text = inputValue.trim();
    setInputValue('');

    // Portfolio intercept at any free-text state
    if (isPortfolioRequest(text)) {
      handlePortfolioRequest(text);
      return;
    }

    addUserMessage(text);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      if (conversationState === 'discovery_1') {
        addAIMessage('Nice 👀 Is this a mobile app, website, or something else?');
        setConversationState('discovery_2');
      } else if (conversationState === 'discovery_2') {
        addAIMessage('What stage is it at right now?');
        setConversationState('discovery_3');
      } else if (conversationState === 'discovery_3') {
        addAIMessage('Do you already have a brief, or are we starting from scratch?');
        setConversationState('depth_1');
      } else if (conversationState === 'depth_1') {
        addAIMessage("What problem is this solving? (pitch it like you're talking to an investor 😄)");
        setConversationState('depth_2');
      } else if (conversationState === 'depth_2') {
        addAIMessage('What timeline are you working with?');
        setConversationState('budget');
      } else if (conversationState === 'budget') {
        addAIMessage('Quick one—what budget range are you working with?', BUDGET_OPTIONS);
        setAwaitingChip(true);
        setConversationState('pricing_anchor');
      }
    }, 1000 + Math.random() * 400);
  };

  const handleChipClick = (chip: string) => {
    if (isTyping) return;
    if (conversationState === 'pricing_anchor') handleBudgetSelection(chip);
    else if (conversationState === 'align_check') handleAlignResponse(chip);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDone = conversationState === 'done';
  const inputDisabled = isTyping || awaitingChip || isDone;

  if (!isOpen) return null;

  // Dark mode tokens
  const modalBg     = isDark ? '#14141e' : '#ffffff';
  const headerBorder= isDark ? '#1f1f30' : '#f1f5f9';
  const nameColor   = isDark ? '#e8e8f8' : '#1e293b';
  const subColor    = isDark ? '#6060a0' : '#64748b';
  const aiBubble    = isDark ? '#1e1e2e' : '#f8f9fa';
  const aiText      = isDark ? '#d0d0ea' : '#1e293b';
  const inputBg     = isDark ? '#1a1a28' : '#fafafa';
  const inputBorder = isDark ? '#2a2a40' : '#e2e8f0';
  const inputFocus  = '#7b74ff';
  const dividerColor= isDark ? '#1f1f30' : '#f1f5f9';
  const hintColor   = isDark ? '#3a3a60' : '#94a3b8';
  const cardBg      = isDark ? '#1a1a28' : '#ffffff';
  const cardBorder  = isDark ? '#2a2a3a' : '#F1F1F1';
  const tagBg       = isDark ? '#22223a' : '#F5F5F5';
  const tagColor    = isDark ? '#9090c0' : '#444';
  const ctaTextColor= isDark ? '#c0c0e0' : '#000000';
  const bookingCard = isDark
    ? { background: 'linear-gradient(135deg, #1a1a3010 0%, #2a2a5018 100%)', border: '1.5px solid #7b74ff40' }
    : { background: 'linear-gradient(135deg, #5b6ef510 0%, #7b74ff18 100%)', border: '1.5px solid #7b74ff40' };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
      <div
        className="w-full sm:max-w-lg flex flex-col overflow-hidden"
        style={{
          height: '92dvh',
          borderRadius: '20px 20px 0 0',
          background: modalBg,
        }}
      >
        <style>{`
          @media (min-width: 640px) {
            .chat-modal-inner {
              height: 620px !important;
              border-radius: 16px !important;
            }
          }
        `}</style>
        <div
          className="chat-modal-inner w-full sm:max-w-lg flex flex-col overflow-hidden"
          style={{ height: '100%', borderRadius: 'inherit', background: modalBg }}
        >

        {/* Header */}
        <div
          className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${headerBorder}` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
              <img src={logoImage} alt="MyClone AI" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 style={{ fontWeight: 600, color: nameColor }}>MyClone AI</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                <p className="text-xs" style={{ color: subColor }}>Adebayo's AI Assistant</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="transition-all duration-200 p-2 rounded-full"
            style={{ color: hintColor }}
            onMouseEnter={(e) => { e.currentTarget.style.color = nameColor; e.currentTarget.style.background = isDark ? '#22223a' : '#f1f5f9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = hintColor; e.currentTarget.style.background = 'transparent'; }}
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 sm:py-5 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'items-start'}`}
            >
              {message.type === 'ai' && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden mt-0.5">
                  <img src="https://via.placeholder.com/150" alt="AI" className="w-full h-full object-cover" />
                </div>
              )}

              <div className={`flex-1 ${message.type === 'user' ? 'flex flex-col items-end' : ''}`}>

                {/* Booking card */}
                {message.isBookingCard ? (
                  <div className="rounded-2xl p-4 max-w-[88%]" style={bookingCard}>
                    <p className="text-sm mb-3" style={{ color: aiText }}>
                      Ready to go deeper and map everything properly?
                    </p>
                    <a
                      href="#"
                      className="flex items-center gap-2 justify-center px-5 py-2.5 rounded-full text-white text-sm transition-all duration-200 hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #5b6ef5 0%, #6c63ff 50%, #7b74ff 100%)' }}
                      onClick={(e) => e.preventDefault()}
                    >
                      <Calendar className="w-4 h-4" />
                      Book a Call
                    </a>
                    <p className="text-xs text-center mt-2" style={{ color: hintColor }}>
                      We'll go deeper and map everything properly.
                    </p>
                  </div>

                ) : message.portfolioProjects ? (
                  /* Portfolio cards */
                  <div className="space-y-3 w-full" style={{ maxWidth: '100%' }}>
                    {message.text && (
                      <p className="text-sm mb-3" style={{ color: aiText }}>{message.text}</p>
                    )}
                    {message.portfolioProjects.map((project) => (
                      <div
                        key={project.title}
                        className="rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
                        style={{
                          background: cardBg,
                          border: `1px solid ${cardBorder}`,
                          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.04)',
                          padding: '16px',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget;
                          el.style.transform = 'translateY(-2px)';
                          el.style.boxShadow = isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.08)';
                          const img = el.querySelector('img') as HTMLImageElement;
                          if (img) img.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget;
                          el.style.transform = 'translateY(0)';
                          el.style.boxShadow = isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.04)';
                          const img = el.querySelector('img') as HTMLImageElement;
                          if (img) img.style.transform = 'scale(1)';
                        }}
                      >
                        <div className="w-full overflow-hidden" style={{ height: '140px', borderRadius: '12px', marginBottom: '12px' }}>
                          <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-300" />
                        </div>
                        <p style={{ fontSize: '16px', lineHeight: '22px', color: isDark ? '#e0e0f0' : '#111111', fontWeight: 500 }}>
                          {project.title}
                        </p>
                        <p style={{ fontSize: '14px', lineHeight: '20px', color: isDark ? '#7070a0' : '#666666', marginTop: '4px' }}>
                          {project.description}
                        </p>
                        <div className="flex items-center justify-between" style={{ marginTop: '12px' }}>
                          <span style={{ background: tagBg, padding: '4px 10px', borderRadius: '999px', fontSize: '12px', color: tagColor, fontWeight: 500 }}>
                            {project.category}
                          </span>
                          <a
                            href={project.link}
                            onClick={(e) => { e.preventDefault(); setActiveCaseStudy(project.title); }}
                            className="transition-opacity duration-200 hover:opacity-70"
                            style={{ fontSize: '13px', color: ctaTextColor, fontWeight: 500, textDecoration: 'none', cursor: 'pointer' }}
                          >
                            View Case Study →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                ) : message.text ? (
                  /* Regular bubble */
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-[88%] ${
                      message.type === 'ai' ? 'rounded-tl-sm' : 'rounded-tr-sm'
                    }`}
                    style={
                      message.type === 'user'
                        ? { background: 'linear-gradient(135deg, #5b6ef5 0%, #6c63ff 50%, #7b74ff 100%)' }
                        : { background: aiBubble }
                    }
                  >
                    {message.text.split('\n').map((line, i) => (
                      <p key={i} className={`text-sm ${i > 0 ? 'mt-1' : ''}`}
                        style={{ color: message.type === 'user' ? '#ffffff' : aiText }}>
                        {line}
                      </p>
                    ))}
                  </div>
                ) : null}

                {/* Quick reply chips */}
                {message.chips && message.chips.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.chips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleChipClick(chip)}
                        disabled={isTyping || !awaitingChip}
                        className="px-3 py-1.5 rounded-full border text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ borderColor: '#7b74ff', color: awaitingChip ? '#6c63ff' : hintColor, background: 'transparent' }}
                        onMouseEnter={(e) => {
                          if (!awaitingChip) return;
                          const el = e.currentTarget;
                          el.style.background = 'linear-gradient(135deg, #5b6ef5 0%, #6c63ff 50%, #7b74ff 100%)';
                          el.style.borderColor = 'transparent';
                          el.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget;
                          el.style.background = 'transparent';
                          el.style.borderColor = '#7b74ff';
                          el.style.color = awaitingChip ? '#6c63ff' : hintColor;
                        }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden mt-0.5">
                <img src={logoImage} alt="AI" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl rounded-tl-sm px-4 py-3" style={{ background: aiBubble }}>
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 bg-[#c4c9f5] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[#c4c9f5] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[#c4c9f5] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 flex-shrink-0" style={{ borderTop: `1px solid ${dividerColor}` }}>
          {isDone ? (
            <p className="text-center text-xs py-1" style={{ color: hintColor }}>
              Conversation ended. Close to start over.
            </p>
          ) : awaitingChip ? (
            <p className="text-center text-xs py-1" style={{ color: hintColor }}>
              Choose an option above to continue 👆
            </p>
          ) : (
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your reply…"
                disabled={inputDisabled}
                className="flex-1 px-4 py-2.5 rounded-full text-sm focus:outline-none transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: inputBg,
                  border: `1px solid ${inputBorder}`,
                  color: isDark ? '#d0d0ea' : '#1e293b',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = inputFocus; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = inputBorder; }}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || inputDisabled}
                className="text-white p-2.5 rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #5b6ef5 0%, #6c63ff 50%, #7b74ff 100%)' }}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Case Study Panel */}
        <CaseStudyModal
          projectTitle={activeCaseStudy}
          onClose={() => setActiveCaseStudy(null)}
        />
        </div>
      </div>
    </div>
  );
}