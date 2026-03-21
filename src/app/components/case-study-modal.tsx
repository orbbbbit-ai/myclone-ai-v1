import { useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Layers, Users, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/theme-context';

export interface CaseStudyData {
  title: string;
  category: string;
  tagline: string;
  heroImage: string;
  role: string;
  timeline: string;
  platform: string;
  overview: string;
  problem: string;
  processImages: string[];
  processCaption: string;
  outcomes: string[];
  resultsImage: string;
}

const CASE_STUDIES: Record<string, CaseStudyData> = {
  'Fintech Mobile App': {
    title: 'Fintech Mobile App',
    category: 'Mobile App',
    tagline: 'End-to-end UX for a scaling startup',
    heroImage:
      'https://images.unsplash.com/photo-1533234944761-2f5337579079?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW50ZWNoJTIwYmFua2luZyUyMGFwcCUyMFVJJTIwaVBob25lfGVufDF8fHx8MTc3NDA0NzQwNHww&ixlib=rb-4.1.0&q=80&w=1080',
    role: 'Lead Product Designer',
    timeline: '14 weeks',
    platform: 'iOS & Android',
    overview:
      'A scaling fintech startup needed to redesign their onboarding and core transaction flows. Drop-off was high, trust was low, and the product felt like a prototype.',
    problem:
      'Users were abandoning sign-up at step 3 of 6. The transaction UI created anxiety rather than confidence. The product lacked the visual language to compete with Tier 1 fintech brands.',
    processImages: [
      'https://images.unsplash.com/photo-1757301714935-c8127a21abc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBwYXltZW50JTIwYXBwJTIwVUklMjBkZXNpZ258ZW58MXx8fHwxNzc0MDQ3NDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1604952703578-8ae924053711?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwZGVzaWduJTIwd2lyZWZyYW1lJTIwc2tldGNoaW5nfGVufDF8fHx8MTc3NDA0NzQwMnww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    processCaption: 'From whiteboard to high-fidelity — structured thinking at every stage.',
    outcomes: [
      'Onboarding completion rate improved by 63%',
      'Transaction error rate dropped from 18% to 4%',
      'App Store rating moved from 3.1 → 4.6 in 60 days',
      'Raised Series A within 4 months of launch',
    ],
    resultsImage:
      'https://images.unsplash.com/photo-1767449280971-46e438b1ce4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW50ZWNoJTIwbW9iaWxlJTIwYXBwJTIwVUklMjBzY3JlZW58ZW58MXx8fHwxNzc0MDQ2ODE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  'SaaS Dashboard': {
    title: 'SaaS Dashboard',
    category: 'SaaS',
    tagline: 'Product structure and user flow optimisation',
    heroImage:
      'https://images.unsplash.com/photo-1762340274490-9179a4ec9052?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYWFTJTIwZGFzaGJvYXJkJTIwZGFyayUyMGFuYWx5dGljcyUyMHByb2R1Y3R8ZW58MXx8fHwxNzc0MDQ3NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    role: 'Product Design Lead',
    timeline: '10 weeks',
    platform: 'Web (B2B)',
    overview:
      'A B2B SaaS platform with strong backend capabilities but a dashboard that was losing enterprise clients to competitors with cleaner UX. Navigation was broken. Data was noisy.',
    problem:
      'Power users were spending 40% of their time searching for features that already existed. New users couldn\'t find value within the first session. Churn was climbing.',
    processImages: [
      'https://images.unsplash.com/photo-1646579886741-12b59840c63f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcmVzZWFyY2glMjBpbnRlcnZpZXclMjBwcm9kdWN0JTIwdGVhbXxlbnwxfHx8fDE3NzQwNDc0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1604952703578-8ae924053711?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwZGVzaWduJTIwd2lyZWZyYW1lJTIwc2tldGNoaW5nfGVufDF8fHx8MTc3NDA0NzQwMnww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    processCaption: 'User interviews, card sorting, and flow mapping before touching Figma.',
    outcomes: [
      'Time-to-value for new users cut from 8 mins → 2.5 mins',
      'Feature discovery increased by 74%',
      'Monthly churn dropped from 9% to 3.2%',
      'Enterprise tier renewals up 40% post-launch',
    ],
    resultsImage:
      'https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYWFTJTIwZGFzaGJvYXJkJTIwYW5hbHl0aWNzJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc3Mzk1ODE3MXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
};

interface CaseStudyModalProps {
  projectTitle: string | null;
  onClose: () => void;
}

export function CaseStudyModal({ projectTitle, onClose }: CaseStudyModalProps) {
  const { isDark } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const study = projectTitle ? CASE_STUDIES[projectTitle] : null;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [projectTitle]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!study) return null;

  const panelBg      = isDark ? '#14141e' : '#ffffff';
  const headerBorder = isDark ? '#1f1f30' : '#F1F1F1';
  const backColor    = isDark ? '#c0c0e0' : '#111';
  const tagBg        = isDark ? '#22223a' : '#F5F5F5';
  const tagColor     = isDark ? '#9090c0' : '#444';
  const titleColor   = isDark ? '#f0f0f8' : '#111111';
  const subColor     = isDark ? '#7070a0' : '#666';
  const metaBg       = isDark ? '#1a1a28' : '#FAFAFA';
  const metaBorder   = isDark ? '#2a2a3a' : '#F1F1F1';
  const metaIcon     = isDark ? '#5050a0' : '#999';
  const metaLabel    = isDark ? '#5050a0' : '#999';
  const metaValue    = isDark ? '#d0d0ea' : '#111';
  const divider      = isDark ? '#1f1f2e' : '#F1F1F1';
  const sectionLabel = isDark ? '#5050a0' : '#999';
  const bodyText     = isDark ? '#a0a0c8' : '#333';
  const captionColor = isDark ? '#4a4a70' : '#999';
  const ctaSubText   = isDark ? '#6060a0' : '#666';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-stretch justify-end"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={scrollRef}
        className="relative w-full sm:max-w-lg h-full overflow-y-auto transition-colors duration-300"
        style={{
          background: panelBg,
          animation: 'slideInRight 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0.6; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>

        {/* Sticky back bar */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
          style={{ background: panelBg, borderBottom: `1px solid ${headerBorder}` }}
        >
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm transition-opacity duration-200 hover:opacity-60"
            style={{ color: backColor }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to chat
          </button>
          <span
            className="text-xs"
            style={{ background: tagBg, padding: '4px 10px', borderRadius: '999px', color: tagColor, fontWeight: 500 }}
          >
            {study.category}
          </span>
        </div>

        {/* Hero image */}
        <div className="w-full overflow-hidden" style={{ height: '220px' }}>
          <img src={study.heroImage} alt={study.title} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="px-6 py-7 space-y-8">

          {/* Title + tagline */}
          <div>
            <h2 style={{ fontSize: '22px', lineHeight: '28px', color: titleColor, fontWeight: 600 }}>
              {study.title}
            </h2>
            <p style={{ fontSize: '14px', color: subColor, marginTop: '6px', lineHeight: '20px' }}>
              {study.tagline}
            </p>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: <Users className="w-4 h-4" />, label: 'Role', value: study.role },
              { icon: <Clock className="w-4 h-4" />, label: 'Timeline', value: study.timeline },
              { icon: <Layers className="w-4 h-4" />, label: 'Platform', value: study.platform },
            ].map(({ icon, label, value }) => (
              <div key={label} className="rounded-xl p-3" style={{ background: metaBg, border: `1px solid ${metaBorder}` }}>
                <div className="flex items-center gap-1.5 mb-1" style={{ color: metaIcon }}>
                  {icon}
                  <span style={{ fontSize: '11px', fontWeight: 500, color: metaLabel }}>{label}</span>
                </div>
                <p style={{ fontSize: '13px', color: metaValue, fontWeight: 500, lineHeight: '18px' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: divider }} />

          {/* Overview */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: sectionLabel, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Overview
            </h3>
            <p style={{ fontSize: '15px', lineHeight: '24px', color: bodyText }}>{study.overview}</p>
          </div>

          {/* Problem */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: sectionLabel, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              The Problem
            </h3>
            <p style={{ fontSize: '15px', lineHeight: '24px', color: bodyText }}>{study.problem}</p>
          </div>

          {/* Process images */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: sectionLabel, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Process
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {study.processImages.map((img, i) => (
                <div key={i} className="overflow-hidden rounded-xl" style={{ height: '130px' }}>
                  <img src={img} alt={`Process ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p style={{ fontSize: '13px', color: captionColor, marginTop: '10px', fontStyle: 'italic' }}>
              {study.processCaption}
            </p>
          </div>

          {/* Results image */}
          <div className="overflow-hidden rounded-xl" style={{ height: '180px' }}>
            <img src={study.resultsImage} alt="Final result" className="w-full h-full object-cover" />
          </div>

          {/* Outcomes */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: sectionLabel, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Outcomes
            </h3>
            <div className="space-y-2.5">
              {study.outcomes.map((outcome, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #5b6ef5 0%, #7b74ff 100%)' }}
                  >
                    <TrendingUp className="w-3 h-3 text-white" />
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: '22px', color: bodyText }}>{outcome}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: divider }} />

          {/* CTA */}
          <div className="text-center pb-4">
            <p style={{ fontSize: '14px', color: ctaSubText, marginBottom: '14px', lineHeight: '20px' }}>
              Building something that needs this level of thinking?
            </p>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm transition-opacity duration-200 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #5b6ef5 0%, #6c63ff 50%, #7b74ff 100%)', fontWeight: 500 }}
            >
              Let's talk about your project →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}