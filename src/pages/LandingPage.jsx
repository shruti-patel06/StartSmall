import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { Button } from '../components/Button';
import {
  CoinIcon,
  FlagIcon,
  QuestionBlockIcon,
  StarIcon,
} from '../components/QuestIcons';

const QUEST_TIPS = [
  'Opening your notes counts as starting.',
  'Five minutes is enough to break the inertia.',
  'One small function beats staring at a blank screen.',
  'You only need to take the first step right now.',
];

export function LandingPage() {
  const navigate = useNavigate();
  const { ensureIdentity } = useSession();
  const [tipIndex, setTipIndex] = useState(0);
  const [coinPopKey, setCoinPopKey] = useState(0);

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
      {/* Top minimal bar */}
      <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-2 flex items-center justify-between">
        <div className="inline-flex items-center gap-2.5 font-black text-xl tracking-tight text-navy">
          <CoinIcon className="w-7 h-7" />
          <span>StartSmall</span>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider bg-white border-2 border-navy/20 text-navy-light px-3 py-1 rounded-full">
          World 1-1 · 5 Min Quest
        </span>
      </header>

      {/* Main Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-2xl text-center space-y-8">
          {/* Interactive Mario-inspired Question Block */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <AnimatePresence mode="popLayout">
                {coinPopKey > 0 && (
                  <motion.div
                    key={coinPopKey}
                    initial={{ opacity: 1, y: 0, scale: 0.8 }}
                    animate={{ opacity: 0, y: -44, scale: 1.15 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2"
                  >
                    <CoinIcon className="w-7 h-7" />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="button"
                onClick={handleBlockTap}
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ y: 4, scale: 0.96 }}
                aria-label="Tap for a study tip"
                className="group relative rounded-2xl focus:outline-none"
              >
                <QuestionBlockIcon className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_4px_0_#2D3436]" />
              </motion.button>
            </div>

            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-xs sm:text-sm font-semibold text-navy-light bg-white/90 border border-navy/15 rounded-full px-3.5 py-1"
            >
              {coinPopKey === 0
                ? 'Tap the ? block for a quick reminder'
                : QUEST_TIPS[tipIndex]}
            </motion.p>
          </div>

          {/* Headline & Copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-4"
          >
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-navy leading-[1.12]">
              You don&apos;t have to finish everything.{' '}
              <span className="inline-block text-coral-500">
                Just start something.
              </span>
            </h1>
            <p className="max-w-xl mx-auto text-base sm:text-lg text-navy-light leading-relaxed">
              Staring at a huge syllabus or coding assignment? Turn one
              overwhelming task into a tiny first step and a five-minute focus
              run. No sign-up, no clutter.
            </p>
          </motion.div>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex flex-col items-center gap-3"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleStart}
              className="text-lg px-10 py-4"
            >
              Start small.
            </Button>
            <span className="text-xs font-medium text-navy-light">
              Takes 10 seconds to set up · 5-minute timer
            </span>
          </motion.div>

          {/* Simple 3-step quest path */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="bg-white border-2 border-navy rounded-2xl p-4 shadow-[0_4px_0_#2D3436] flex items-start gap-3">
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
                    Whatever you&apos;ve been putting off.
                  </p>
                </div>
              </div>

              <div className="bg-white border-2 border-navy rounded-2xl p-4 shadow-[0_4px_0_#2D3436] flex items-start gap-3">
                <div className="shrink-0 mt-0.5 bg-coral-100 border-2 border-navy rounded-xl p-1.5">
                  <CoinIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-navy-light">
                    Step 2
                  </div>
                  <div className="font-bold text-navy text-sm">
                    Pick one tiny action
                  </div>
                  <p className="text-xs text-navy-light mt-0.5">
                    Shrink the friction to zero.
                  </p>
                </div>
              </div>

              <div className="bg-white border-2 border-navy rounded-2xl p-4 shadow-[0_4px_0_#2D3436] flex items-start gap-3">
                <div className="shrink-0 mt-0.5 bg-mint-light border-2 border-navy rounded-xl p-1.5">
                  <FlagIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-navy-light">
                    Step 3
                  </div>
                  <div className="font-bold text-navy text-sm">
                    5-minute focus run
                  </div>
                  <p className="text-xs text-navy-light mt-0.5">
                    Reach the checkpoint flag.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-navy-light">
        Built for students who just need help starting.
      </footer>
    </div>
  );
}
