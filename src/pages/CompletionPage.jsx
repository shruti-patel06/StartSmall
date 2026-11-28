import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { FEEDBACK_OPTIONS } from '../constants/categories';
import { getSessionStats } from '../services/memoryService';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { FlagIcon, StarIcon } from '../components/QuestIcons';

export function CompletionPage() {
  const navigate = useNavigate();
  const { session, resetForNewTask } = useSession();

  useEffect(() => {
    if (!session.taskText) {
      navigate('/', { replace: true });
    }
  }, [session.taskText, navigate]);

  if (!session.taskText) {
    return null;
  }

  const feedbackLabel =
    FEEDBACK_OPTIONS.find((o) => o.id === session.feedbackResponse)?.label ||
    'Session recorded';

  const mins = Math.max(1, Math.round((session.timeSpentSeconds || 300) / 60));
  const { total, completed, streak } = getSessionStats();

  const handleAnother = () => {
    resetForNewTask();
    navigate('/task');
  };

  const handleHome = () => {
    resetForNewTask();
    navigate('/');
  };

  return (
    <Layout showStep={5}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border-2 border-navy rounded-3xl p-5 xs:p-6 sm:p-8 shadow-[0_6px_0_#2D3436] space-y-6 text-center"
      >
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.7, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="w-16 h-16 rounded-2xl bg-mint-light border-2 border-navy flex items-center justify-center shadow-[0_4px_0_#2D3436]"
          >
            <FlagIcon className="w-9 h-9" />
          </motion.div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-navy tracking-tight">
            You showed up. That&apos;s progress.
          </h1>
          <p className="text-sm sm:text-base text-navy-light">
            Starting is the hardest part, and you just cleared it.
          </p>
          {total > 0 && (
            <div className="pt-1 flex justify-center">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-gold-light border-2 border-navy text-navy px-3.5 py-1 rounded-full">
                <span>Session {total}</span>
                <span aria-hidden="true">·</span>
                <span>{streak}-day streak</span>
                {completed > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{completed} finished</span>
                  </>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Summary card */}
        <div className="bg-cream border-2 border-navy/15 rounded-2xl p-5 text-left space-y-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-navy-light">
              Original task
            </div>
            <div className="font-bold text-navy break-words">
              {session.taskText}
            </div>
          </div>

          {session.selectedMicroStep && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-navy-light">
                First action
              </div>
              <div className="font-semibold text-navy">
                {session.selectedMicroStep}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-navy-light">
                Time spent
              </div>
              <div className="font-bold text-navy">{mins} minutes</div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-navy-light">
                Check-in
              </div>
              <div className="font-bold text-navy">{feedbackLabel}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleAnother}
            className="flex-1 inline-flex items-center justify-center gap-2"
          >
            <StarIcon className="w-5 h-5" />
            <span>Start another small task</span>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleHome}
            className="flex-1"
          >
            Back to home
          </Button>
        </div>
      </motion.div>
    </Layout>
  );
}
