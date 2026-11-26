import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import {
  EXPERIMENT_EVENTS,
  FOCUS_DURATION_SECONDS,
} from '../constants/experimentEvents';
import { useFocusTimer } from '../hooks/useFocusTimer';
import { Layout } from '../components/Layout';
import { Timer } from '../components/Timer';
import { Button } from '../components/Button';
import { FlagIcon } from '../components/QuestIcons';

export function FocusSessionPage() {
  const navigate = useNavigate();
  const { session, updateSession, trackEvent } = useSession();

  useEffect(() => {
    if (!session.taskText) {
      navigate('/task', { replace: true });
    }
  }, [session.taskText, navigate]);

  const handleTimerStart = useCallback(() => {
    trackEvent(EXPERIMENT_EVENTS.FOCUS_SESSION_STARTED);
  }, [trackEvent]);

  const handleTimerComplete = useCallback(() => {
    trackEvent(EXPERIMENT_EVENTS.FOCUS_SESSION_COMPLETED);
    updateSession({ timeSpentSeconds: FOCUS_DURATION_SECONDS });
  }, [trackEvent, updateSession]);

  const {
    status,
    remainingSeconds,
    progressPercent,
    start,
    pause,
    reset,
  } = useFocusTimer({
    durationSeconds: FOCUS_DURATION_SECONDS,
    onStart: handleTimerStart,
    onComplete: handleTimerComplete,
  });

  if (!session.taskText) {
    return null;
  }

  return (
    <Layout showStep={3}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white border-2 border-navy rounded-3xl p-6 sm:p-8 shadow-[0_6px_0_#2D3436] space-y-8"
      >
        {/* Task & Micro-Step Header */}
        <div className="text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-coral-500">
            Just focus on this one thing
          </p>
          <h1 className="text-xl sm:text-2xl font-black text-navy break-words">
            {session.taskText}
          </h1>
          {session.selectedMicroStep && (
            <div className="inline-block mt-2 bg-gold-light border-2 border-navy rounded-2xl px-4 py-2 text-sm font-bold text-navy">
              First step: {session.selectedMicroStep}
            </div>
          )}
        </div>

        {/* Countdown */}
        <Timer
          status={status}
          remainingSeconds={remainingSeconds}
          progressPercent={progressPercent}
          onStart={start}
          onPause={pause}
          onReset={reset}
        />

        {/* Completion action */}
        {status === 'completed' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-mint-light border-2 border-navy rounded-2xl p-5 text-center space-y-3"
          >
            <div className="inline-flex items-center gap-2 font-black text-navy text-lg">
              <FlagIcon className="w-6 h-6" />
              <span>Checkpoint reached!</span>
            </div>
            <p className="text-sm text-navy-light">
              You finished your five-minute focus run.
            </p>
            <Button
              variant="mint"
              size="lg"
              onClick={() => navigate('/feedback')}
            >
              Continue to check-in
            </Button>
          </motion.div>
        ) : (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigate('/feedback')}
              className="text-xs font-semibold text-navy-light hover:text-navy underline underline-offset-4"
            >
              End early and check in
            </button>
          </div>
        )}
      </motion.div>
    </Layout>
  );
}
