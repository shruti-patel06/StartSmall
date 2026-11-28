import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { Button } from '../components/Button';
import { Quest3DCube, TiltCard3D } from '../components/Quest3D';
import {
  OverwhelmedStudentIllustration,
  BeforeAfterIllustration,
} from '../components/ProblemIllustrations';
import {
  CoinIcon,
  FlagIcon,
  StarIcon,
  CategoryIcon,
} from '../components/QuestIcons';

const QUEST_TIPS = [
  'Procrastination is emotional avoidance — shrink the start until your brain says yes.',
  'Implementation intentions double follow-through by naming one physical action.',
  'Cross the first 60 seconds and the Zeigarnik effect helps pull you forward.',
  'Opening one file or writing 3 bullet points counts as clearing World 1-1.',
];


const FEATURE_SHOWCASE = [
  {
    flag: 'ai_microsteps',
    tag: 'Groq LLM',
    title: 'AI Task Breakdown',
    bg: 'bg-gold-light/60',
    description:
      'Converts your exact topic into 3 concrete physical steps (<2 mins each) following Orient -> Engage -> Produce. Gracefully falls back to curated templates if offline.',
  },
  {
    flag: 'memory_enabled',
    tag: 'Local-First AI',
    title: 'Adaptive Session Memory',
    bg: 'bg-sky-light',
    description:
      'Stores your last 20 sessions strictly in browser localStorage (no backend) to detect repeat blockers and craft a personalized psychological icebreaker.',
  },
  {
    flag: 'study_music',
    tag: 'Web Audio API',
    title: '3 Focus Soundscapes',
    bg: 'bg-coral-50',
    description:
      'Multivariate Flagsmith audio engine synthesizing Brown Noise, warm Lo-Fi Ambient Chords, and 40Hz Binaural Beats locally with zero external audio failures.',
  },
  {
    flag: 'fullscreen_focus',
    tag: 'Commitment Mode',
    title: 'Fullscreen Focus Lock',
    bg: 'bg-mint-light/70',
    description:
      'Locks the active sprint into fullscreen on timer start to remove distracting tabs and reinforce your 5-minute commitment.',
  },
  {
    flag: 'study_start_flow',
    tag: 'Flagsmith A/B',
    title: 'Live Experimentation Engine',
    bg: 'bg-cream',
    description:
      'Tests Guided Micro-Steps vs. Plain Timer on a 50/50 split, tracking focus_session_started and focus_session_completed with strict event deduplication.',
  },
];

const USE_CASES = [
  {
    category: 'book',
    label: 'Dense Textbook',
    before: '"Read OS Memory Management chapters"',
    after: 'Highlight key terms (page table, TLB) in paragraph 1 & write a 1-line summary.',
  },
  {
    category: 'code',
    label: 'Coding Assignment',
    before: '"Build authentication & fix failing tests"',
    after: 'Open the auth handler and inspect the exact failing assertion on line 1.',
  },
  {
    category: 'puzzle',
    label: 'Problem Set',
    before: '"Finish 12 calculus homework problems"',
    after: 'Copy equation #1 onto paper and list only the given variables.',
  },
  {
    category: 'refresh',
    label: 'Exam Revision',
    before: '"Revise entire semester syllabus"',
    after: 'Brain-dump 5 formulas from memory before opening your notes.',
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { ensureIdentity } = useSession();
  const [tipIndex, setTipIndex] = useState(0);
  const [coinPopKey, setCoinPopKey] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStart = () => {
    ensureIdentity();
    navigate('/task');
  };

  const handleBlockTap = () => {
    setTipIndex((prev) => (prev + 1) % QUEST_TIPS.length);
    setCoinPopKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-quest-grid flex flex-col justify-between">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-20 backdrop-blur-sm bg-cream/90 border-b-2 border-navy/10">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2.5 font-black text-xl tracking-tight text-navy">
            <CoinIcon className="w-7 h-7" />
            <span>StartSmall</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-navy-light">
            <a href="#psychology" className="hover:text-navy transition-colors">
              Why 60s?
            </a>
            <a href="#features" className="hover:text-navy transition-colors">
              Features & Flags
            </a>
            <a href="#use-cases" className="hover:text-navy transition-colors">
              Use Cases
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider bg-white border-2 border-navy/20 text-navy-light px-3 py-1 rounded-full">
              Toggle Wars · Track 01
            </span>
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -mr-2 text-navy hover:bg-navy/5 rounded-xl transition-colors"
              aria-label="Toggle navigation menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                {mobileMenuOpen ? (
                  <>
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="6" y1="18" x2="18" y2="6" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b-2 border-navy/10 overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-3 gap-1">
              {[
                { href: '#psychology', label: 'Why 60s?' },
                { href: '#features', label: 'Features & Flags' },
                { href: '#use-cases', label: 'Use Cases' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-navy-light hover:text-navy py-2 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <span className="sm:hidden text-xs font-bold uppercase tracking-wider text-navy-light mt-1 pb-1">
                Toggle Wars · Track 01
              </span>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-14 sm:space-y-20">
        {/* Hero with interactive 3D cube */}
        <section className="text-center max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <div className="flex flex-col items-center pt-2">
            <div className="relative py-2">
              <AnimatePresence mode="popLayout">
                {coinPopKey > 0 && (
                  <motion.div
                    key={coinPopKey}
                    initial={{ opacity: 1, y: 0, scale: 0.8 }}
                    animate={{ opacity: 0, y: -52, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 z-10"
                  >
                    <CoinIcon className="w-8 h-8" />
                  </motion.div>
                )}
              </AnimatePresence>

              <Quest3DCube onTap={handleBlockTap} tapCount={coinPopKey} />
            </div>

            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 max-w-lg text-xs sm:text-sm font-semibold text-navy bg-white border-2 border-navy/15 rounded-full px-4 py-1.5 shadow-sm"
            >
              {coinPopKey === 0
                ? 'Tap the 3D quest block for psychology tips'
                : QUEST_TIPS[tipIndex]}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-4"
          >
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-navy leading-[1.1]">
              Starting is the hardest part.{' '}
              <span className="inline-block text-coral-500">
                We help you survive the first 60 seconds.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-navy-light leading-relaxed">
              A science-backed initiation coach for students facing big,
              intimidating tasks. Break paralysis with AI micro-steps, adaptive
              local memory, and live Flagsmith A/B experimentation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStart}
                className="text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 w-full sm:w-auto"
              >
                Start small.
              </Button>
              <a
                href="#features"
                className="inline-flex items-center justify-center font-bold rounded-2xl border-2 border-navy bg-white text-navy px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base shadow-[0_4px_0_#2D3436] hover:bg-cream transition-all w-full sm:w-auto"
              >
                Explore 3D feature tour ↓
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] xs:text-xs font-bold text-navy-light">
              <span className="bg-white border border-navy/15 rounded-full px-3 py-1">
                ⚡ 10-second setup
              </span>
              <span className="bg-white border border-navy/15 rounded-full px-3 py-1">
                🧠 Groq AI + On-Device Memory
              </span>
              <span className="bg-white border border-navy/15 rounded-full px-3 py-1">
                🎛️ 5 Live Flagsmith Flags
              </span>
            </div>
          </motion.div>
        </section>

        {/* Section 1: Why It Matters */}
        <section id="psychology" className="space-y-8 scroll-mt-20">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-coral-500 bg-coral-50 border border-coral-200 rounded-full px-3 py-1">
              The Real Problem
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
              Most timers assume you&apos;ve already started.
            </h2>
          </div>

          {/* Illustration 1 — full width, big */}
          <div className="bg-white border-2 border-navy rounded-3xl overflow-hidden shadow-[0_8px_0_#2D3436]">
            <OverwhelmedStudentIllustration className="w-full" />
            <div className="px-6 py-4 border-t border-navy/10 flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm font-black text-coral-500 shrink-0">The initiation gap</span>
              <span className="text-sm text-navy-light">
                Procrastination is emotional avoidance — a vague task triggers a threat response before you even open your laptop.
              </span>
            </div>
          </div>

          {/* Illustration 2 — full width, big */}
          <div className="bg-white border-2 border-navy rounded-3xl overflow-hidden shadow-[0_8px_0_#2D3436]">
            <BeforeAfterIllustration className="w-full" />
            <div className="px-6 py-4 border-t border-navy/10 flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm font-black text-mint shrink-0">60 seconds changes everything</span>
              <span className="text-sm text-navy-light">
                Naming one physical action crosses the initiation threshold — after that the Zeigarnik effect pulls you forward.
              </span>
            </div>
          </div>

          {/* 3 compact stat badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { badge: 'Emotional Regulation', stat: '2×', label: 'more follow-through with implementation intentions', accent: 'border-coral-200 bg-coral-50 text-coral-500', cite: 'Gollwitzer' },
              { badge: 'Zeigarnik Effect', stat: '60s', label: 'is enough to activate task completion momentum', accent: 'border-gold bg-gold-light text-navy', cite: 'Zeigarnik' },
              { badge: 'Ego Depletion', stat: '1 step', label: 'tiny first action beats willpower every time', accent: 'border-mint bg-mint-light text-navy', cite: 'Baumeister' },
            ].map((s) => (
              <div key={s.badge} className={`flex items-center gap-4 border-2 ${s.accent} rounded-2xl px-5 py-4`}>
                <span className="text-3xl font-black shrink-0">{s.stat}</span>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider opacity-70">{s.badge} · {s.cite}</div>
                  <div className="text-sm font-semibold text-navy mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Interactive 3D Feature & Flagship Breakdown */}
        <section id="features" className="space-y-6 scroll-mt-20">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-navy bg-gold-light border border-gold rounded-full px-3 py-1">
              Architecture · Interactive 3D Cards
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
              Every capability controlled by live Flagsmith flags
            </h2>
            <p className="text-sm sm:text-base text-navy-light">
              Hover over any card to inspect the 5 production flags powering the
              StartSmall experiment suite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURE_SHOWCASE.map((item) => (
              <TiltCard3D
                key={item.flag}
                className={`h-full ${item.bg} border-2 border-navy rounded-3xl p-6 shadow-[0_6px_0_#2D3436] space-y-3`}
              >
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs font-bold bg-white border border-navy/25 text-navy px-2.5 py-1 rounded-lg">
                    {item.flag}
                  </code>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-navy-light">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-lg font-black text-navy">{item.title}</h3>
                <p className="text-sm text-navy-light leading-relaxed">
                  {item.description}
                </p>
              </TiltCard3D>
            ))}

            {/* 6th slot: 5-stage loop summary card */}
            <TiltCard3D className="h-full bg-white border-2 border-navy rounded-3xl p-6 shadow-[0_6px_0_#2D3436] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-block text-xs font-bold uppercase tracking-wider bg-navy text-white px-2.5 py-1 rounded-lg">
                  5-Stage Loop
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-navy-light">
                  Zero Clutter
                </span>
              </div>
              <h3 className="text-lg font-black text-navy">
                Designed for momentum
              </h3>
              <p className="text-sm text-navy-light leading-relaxed">
                1. Name Task → 2. Pick AI Micro-Step → 3. 5-Min Focus Sprint →
                4. Quick Check-in → 5. Streak &amp; Memory Update.
              </p>
            </TiltCard3D>
          </div>
        </section>

        {/* Section 3: Student Use Cases + 3-Step Path */}
        <section id="use-cases" className="space-y-8 scroll-mt-20">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-navy bg-mint-light border border-mint rounded-full px-3 py-1">
              Student Use Cases
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
              From blank-page panic to instant motion
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {USE_CASES.map((uc) => (
              <div
                key={uc.label}
                className="bg-white border-2 border-navy rounded-2xl p-5 shadow-[0_4px_0_#2D3436] flex items-start gap-4"
              >
                <div className="shrink-0 bg-cream border-2 border-navy rounded-xl p-2.5">
                  <CategoryIcon name={uc.category} className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wider text-coral-500">
                    {uc.label}
                  </div>
                  <div className="text-xs font-semibold text-navy-muted line-through">
                    {uc.before}
                  </div>
                  <div className="text-sm font-bold text-navy leading-snug">
                    → {uc.after}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 3-Step Quest Summary Banner */}
          <div className="bg-white border-2 border-navy rounded-3xl p-6 sm:p-8 shadow-[0_6px_0_#2D3436] space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-cream border-2 border-navy/15 rounded-2xl p-4 flex items-start gap-3">
                <div className="shrink-0 mt-0.5 bg-gold-light border-2 border-navy rounded-xl p-1.5">
                  <StarIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-navy-light">
                    Step 1
                  </div>
                  <div className="font-bold text-navy text-sm">
                    Name the big task
                  </div>
                  <p className="text-xs text-navy-light mt-0.5">
                    Whatever you&apos;ve been avoiding.
                  </p>
                </div>
              </div>

              <div className="bg-cream border-2 border-navy/15 rounded-2xl p-4 flex items-start gap-3">
                <div className="shrink-0 mt-0.5 bg-coral-100 border-2 border-navy rounded-xl p-1.5">
                  <CoinIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-navy-light">
                    Step 2
                  </div>
                  <div className="font-bold text-navy text-sm">
                    Pick 1 tiny AI step
                  </div>
                  <p className="text-xs text-navy-light mt-0.5">
                    Shrink start friction to zero.
                  </p>
                </div>
              </div>

              <div className="bg-cream border-2 border-navy/15 rounded-2xl p-4 flex items-start gap-3">
                <div className="shrink-0 mt-0.5 bg-mint-light border-2 border-navy rounded-xl p-1.5">
                  <FlagIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-navy-light">
                    Step 3
                  </div>
                  <div className="font-bold text-navy text-sm">
                    5-minute focus sprint
                  </div>
                  <p className="text-xs text-navy-light mt-0.5">
                    Audio + fullscreen checkpoint.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t-2 border-navy/10">
              <div>
                <div className="font-black text-navy text-lg">
                  Ready to cross your first 60 seconds?
                </div>
                <div className="text-xs font-medium text-navy-light">
                  No sign-up required · Anonymous Flagsmith experimentation enabled
                </div>
              </div>
              <Button variant="primary" size="lg" onClick={handleStart} className="w-full sm:w-auto">
                Start small.
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-navy-light border-t border-navy/10 safe-bottom">
        StartSmall · Built for students who need help starting · Powered by Flagsmith &amp; Groq
      </footer>
    </div>
  );
}
