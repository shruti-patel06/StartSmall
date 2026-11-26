import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import {
  EXPERIMENT_EVENTS,
  EXPERIMENT_VARIANTS,
} from '../constants/experimentEvents';
import { getMicroStepsForCategory } from '../services/taskSuggestionService';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { StarIcon, FlagIcon } from '../components/QuestIcons';

export function StartExperiencePage() {
  const navigate = useNavigate();
  const { session, updateSession, experimentVariant, trackEvent } =
    useSession();

  const [selectedStep, setSelectedStep] = useState(
    session.selectedMicroStep || ''
  );
  const [stepError, setStepError] = useState('');

  useEffect(() => {
    if (!session.taskText || !session.taskCategory) {
      navigate('/task', { replace: true });
    }
  }, [session.taskText, session.taskCategory, navigate]);

  if (!session.taskText || !session.taskCategory) {
    return null;
  }

  const isGuided = experimentVariant === EXPERIMENT_VARIANTS.GUIDED;
  const suggestions = isGuided
    ? getMicroStepsForCategory(session.taskCategory)
    : [];

  const handleSelectStep = (step) => {
    setSelectedStep(step);
    setStepError('');
    trackEvent(EXPERIMENT_EVENTS.MICRO_STEP_SELECTED);
  };

  const handleStartSession = () => {
    if (isGuided && !selectedStep) {
      setStepError('Pick one tiny action to begin.');
      return;
    }

    updateSession({
      selectedMicroStep: isGuided ? selectedStep : '',
    });
    navigate('/focus');
  };

  return (
    <Layout showStep={2}>
      <motion.div
        key={experimentVariant}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white border-2 border-navy rounded-3xl p-6 sm:p-8 shadow-[0_6px_0_#2D3436] space-y-6"
      >
        {/* Task Context Pill */}
        <div className="bg-cream border-2 border-navy/15 rounded-2xl p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-navy-light mb-1">
            Your task
          </div>
          <div className="font-bold text-navy text-base sm:text-lg break-words">
            {session.taskText}
          </div>
        </div>

        {isGuided ? (
          /* Variation B — Guided Micro-Step Experience */
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
                What&apos;s one tiny thing you can do right now?
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-navy-light">
                Pick one small starting step. You don&apos;t have to finish the
                whole task.
              </p>
            </div>

            <div
              role="radiogroup"
              aria-label="Suggested micro-steps"
              className="space-y-3"
            >
              {suggestions.map((step, idx) => {
                const active = selectedStep === step;
                return (
                  <motion.button
                    key={step}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => handleSelectStep(step)}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 1 }}
                    className={`w-full flex items-center gap-3.5 rounded-2xl border-2 px-4 py-3.5 text-left font-semibold transition-all ${
                      active
                        ? 'border-navy bg-gold-light text-navy shadow-[0_4px_0_#2D3436]'
                        : 'border-navy/25 bg-white text-navy hover:border-navy'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 text-sm font-black ${
                        active
                          ? 'border-navy bg-gold text-navy'
                          : 'border-navy/20 bg-cream text-navy-light'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-sm sm:text-base">{step}</span>
                  </motion.button>
                );
              })}
            </div>

            {stepError && (
              <p role="alert" className="text-sm font-semibold text-coral-500">
                {stepError}
              </p>
            )}
          </div>
        ) : (
          /* Variation A — Conventional Starting Experience (Control) */
          <div className="space-y-4 py-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-light bg-cream border border-navy/15 rounded-full px-3 py-1">
              <FlagIcon className="w-4 h-4" />
              <span>5-minute sprint</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
              Ready to get started?
            </h1>
            <p className="text-base text-navy-light leading-relaxed">
              Spend the next five minutes making progress on this task.
            </p>
          </div>
        )}

        <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/task')}
          >
            Edit task
          </Button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleStartSession}
            className="w-full sm:w-auto inline-flex items-center gap-2"
          >
            <StarIcon className="w-5 h-5" />
            <span>Start my five-minute session</span>
          </Button>
        </div>
      </motion.div>
    </Layout>
  );
}
