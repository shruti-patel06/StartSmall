import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { EXPERIMENT_EVENTS } from '../constants/experimentEvents';
import { Layout } from '../components/Layout';
import { FeedbackForm } from '../components/FeedbackForm';

export function FeedbackPage() {
  const navigate = useNavigate();
  const { session, saveLocalFeedback, resetForNewTask, trackEvent } =
    useSession();

  useEffect(() => {
    if (!session.taskText) {
      navigate('/task', { replace: true });
    }
  }, [session.taskText, navigate]);

  if (!session.taskText) {
    return null;
  }

  const handleFinish = (responseId, note) => {
    saveLocalFeedback(responseId, note);
    trackEvent(EXPERIMENT_EVENTS.FOCUS_SESSION_FEEDBACK_SUBMITTED);
    navigate('/complete');
  };

  const handleStartAnother = () => {
    resetForNewTask();
    navigate('/task');
  };

  return (
    <Layout showStep={4}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white border-2 border-navy rounded-3xl p-5 xs:p-6 sm:p-8 shadow-[0_6px_0_#2D3436] space-y-6"
      >
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-navy-light bg-cream border border-navy/15 rounded-full px-3 py-1 mb-3">
            Stage 4 · Quick check-in
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
            How did that go?
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-navy-light">
            Be honest — even opening your notes is a win.
          </p>
        </div>

        <FeedbackForm
          alreadySubmitted={session.feedbackSubmitted}
          onSubmitFinish={handleFinish}
          onStartAnother={handleStartAnother}
        />
      </motion.div>
    </Layout>
  );
}
