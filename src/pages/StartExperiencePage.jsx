import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlags } from '@flagsmith/flagsmith/react';
import { useExperiment, useFlagsmithLoading } from '@flagsmith/flagsmith/react';
import { useSession } from '../context/SessionContext';
import { FLAGSMITH_CONFIG } from '../flagsmith/experimentConfig';
import { FLAGS, MUSIC_VARIANTS } from '../flagsmith/flags';
import { isFlagsmithConfigured } from '../flagsmith/flagsmithClient';
import { EXPERIMENT_EVENTS, EXPERIMENT_VARIANTS } from '../constants/experimentEvents';
import { getRecentSessions, hasEnoughHistoryForMemory } from '../services/memoryService';
import { generateMicroSteps, generateIcebreaker } from '../services/aiService';
import { getMicroStepsForCategory } from '../services/taskSuggestionService';
import { MUSIC_LABELS } from '../services/musicService';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { StarIcon, FlagIcon } from '../components/QuestIcons';

export function StartExperiencePage() {
  const navigate = useNavigate();
  const {
    session,
    updateSession,
    ensureIdentity,
    setExperimentAssignment,
    trackEvent,
  } = useSession();

  useEffect(() => { ensureIdentity(); }, [ensureIdentity]);

  // ── Experiment flag (exposure recorded here, not before) ──────────────────
  const experimentFlag = useExperiment(FLAGSMITH_CONFIG.experimentFlagKey);
  const loadingState = useFlagsmithLoading();

  // ── Other feature flags ───────────────────────────────────────────────────
  const featureFlags = useFlags([
    FLAGS.AI_MICROSTEPS,
    FLAGS.MEMORY_ENABLED,
    FLAGS.STUDY_MUSIC,
  ]);
  const aiMicrostepsEnabled = featureFlags[FLAGS.AI_MICROSTEPS]?.enabled ?? false;
  const memoryEnabled = featureFlags[FLAGS.MEMORY_ENABLED]?.enabled ?? false;
  const musicVariant = featureFlags[FLAGS.STUDY_MUSIC]?.value || MUSIC_VARIANTS.OFF;

  // ── Local state ───────────────────────────────────────────────────────────
  const [flagResolved, setFlagResolved] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [selectedStep, setSelectedStep] = useState(session.selectedMicroStep || '');
  const [stepError, setStepError] = useState('');
  const [selectedMusic, setSelectedMusic] = useState(null);

  const effectiveMusicVariant = selectedMusic || musicVariant;

  // AI state
  const [aiSteps, setAiSteps] = useState(null);
  const [icebreaker, setIcebreaker] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSource, setAiSource] = useState('static');

  useEffect(() => {
    if (!session.taskText || !session.taskCategory) {
      navigate('/task', { replace: true });
    }
  }, [session.taskText, session.taskCategory, navigate]);

  useEffect(() => {
    if (experimentFlag !== null && experimentFlag !== undefined) {
      setFlagResolved(true);
    }
  }, [experimentFlag]);

  useEffect(() => {
    if (!isFlagsmithConfigured()) { setTimedOut(true); return; }
    const timer = setTimeout(() => setTimedOut(true), FLAGSMITH_CONFIG.loadTimeoutMs);
    return () => clearTimeout(timer);
  }, []);

  const configured = isFlagsmithConfigured();
  const isWaitingForFlag =
    configured && !timedOut && !flagResolved &&
    !loadingState?.error &&
    Boolean(loadingState?.isLoading || loadingState?.isFetching);

  const isEnrolled =
    configured && flagResolved &&
    !loadingState?.error &&
    Boolean(experimentFlag?.experiment?.inExperiment);

  const isGuidedAssigned =
    experimentFlag?.value === EXPERIMENT_VARIANTS.GUIDED ||
    experimentFlag?.variant === EXPERIMENT_VARIANTS.GUIDED;
  const resolvedVariant =
    isEnrolled && isGuidedAssigned
      ? EXPERIMENT_VARIANTS.GUIDED
      : EXPERIMENT_VARIANTS.CONTROL;

  useEffect(() => {
    if (isWaitingForFlag) return;
    setExperimentAssignment(resolvedVariant, isEnrolled);
  }, [isWaitingForFlag, resolvedVariant, isEnrolled, setExperimentAssignment]);

  // ── Load AI steps once flags and task are resolved ────────────────────────
  const loadAiContent = useCallback(async () => {
    if (!session.taskText || !session.taskCategory || aiSteps) return;
    if (!aiMicrostepsEnabled) return;

    setAiLoading(true);
    try {
      const history = getRecentSessions(5);
      const useMemory = memoryEnabled && hasEnoughHistoryForMemory(history);

      const [stepsResult, icebreakerText] = await Promise.all([
        generateMicroSteps({
          taskText: session.taskText,
          category: session.taskCategory,
          sessionHistory: history,
          hasMemory: useMemory,
        }),
        useMemory
          ? generateIcebreaker({
              taskText: session.taskText,
              category: session.taskCategory,
              sessionHistory: history,
            })
          : Promise.resolve(null),
      ]);

      setAiSteps(stepsResult.steps);
      setAiSource(stepsResult.source);
      if (icebreakerText) setIcebreaker(icebreakerText);
    } catch {
      setAiSteps(getMicroStepsForCategory(session.taskCategory));
      setAiSource('fallback');
    } finally {
      setAiLoading(false);
    }
  }, [session.taskText, session.taskCategory, aiMicrostepsEnabled, memoryEnabled, aiSteps]);

  useEffect(() => {
    if (!isWaitingForFlag && resolvedVariant === EXPERIMENT_VARIANTS.GUIDED) {
      loadAiContent();
    }
  }, [isWaitingForFlag, resolvedVariant, loadAiContent]);

  if (!session.taskText || !session.taskCategory) return null;

  if (isWaitingForFlag) {
    return (
      <Layout showStep={2}>
        <div className="bg-white border-2 border-navy rounded-3xl p-8 shadow-[0_6px_0_#2D3436] text-center space-y-4">
          <div className="w-10 h-10 mx-auto border-4 border-navy/20 border-t-coral-400 rounded-full animate-spin" />
          <p className="text-sm font-bold text-navy-light">Preparing your study quest...</p>
        </div>
      </Layout>
    );
  }

  const isGuided = resolvedVariant === EXPERIMENT_VARIANTS.GUIDED;
  const displaySteps = aiMicrostepsEnabled && aiSteps
    ? aiSteps
    : getMicroStepsForCategory(session.taskCategory);

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
      studyMusicType: effectiveMusicVariant,
    });
    navigate('/focus');
  };

  return (
    <Layout showStep={2}>
      <motion.div
        key={resolvedVariant}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white border-2 border-navy rounded-3xl p-5 xs:p-6 sm:p-8 shadow-[0_6px_0_#2D3436] space-y-6"
      >
        {/* Task context */}
        <div className="bg-cream border-2 border-navy/15 rounded-2xl p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-navy-light mb-1">Your task</div>
          <div className="font-bold text-navy text-base sm:text-lg break-words">{session.taskText}</div>
        </div>

        {/* AI icebreaker — only shown when memory is active and icebreaker exists */}
        <AnimatePresence>
          {icebreaker && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-sky-light border-2 border-sky-400/40 rounded-2xl px-4 py-3"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
                💡 Based on your history
              </div>
              <p className="text-sm font-semibold text-navy leading-relaxed">{icebreaker}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Music mode selector when Flagsmith enables study_music */}
        {musicVariant !== MUSIC_VARIANTS.OFF && (
          <div className="bg-cream border border-navy/15 rounded-2xl px-4 py-3 space-y-2">
            <div className="flex items-center justify-between gap-2 text-xs font-bold text-navy-light">
              <span>🎵 Focus soundscape (default from Flagsmith)</span>
              <span className="text-navy">{MUSIC_LABELS[effectiveMusicVariant]}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: MUSIC_VARIANTS.BROWN_NOISE, label: 'Brown noise' },
                { id: MUSIC_VARIANTS.LOFI, label: 'Lo-fi chords' },
                { id: MUSIC_VARIANTS.BINAURAL, label: '40Hz Binaural' },
              ].map((opt) => {
                const active = effectiveMusicVariant === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedMusic(opt.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all ${
                      active
                        ? 'border-navy bg-gold-light text-navy shadow-[0_2px_0_#2D3436]'
                        : 'border-navy/20 bg-white text-navy-light hover:border-navy'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isGuided ? (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
                What's one tiny thing you can do right now?
              </h1>
              <div className="mt-1.5 flex items-center gap-2">
                <p className="text-sm sm:text-base text-navy-light">
                  Pick one small starting step.
                </p>
                {aiMicrostepsEnabled && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    aiSource === 'ai'
                      ? 'bg-gold-light border-gold text-navy'
                      : 'bg-cream border-navy/20 text-navy-light'
                  }`}>
                    {aiLoading ? 'AI thinking...' : aiSource === 'ai' ? '✦ AI-personalised' : 'Template'}
                  </span>
                )}
              </div>
            </div>

            {aiLoading ? (
              <div className="flex items-center justify-center gap-3 py-8 text-navy-light">
                <div className="w-5 h-5 border-2 border-navy/20 border-t-coral-400 rounded-full animate-spin" />
                <span className="text-sm font-semibold">Generating steps for your task...</span>
              </div>
            ) : (
              <div role="radiogroup" aria-label="Suggested micro-steps" className="space-y-3">
                {displaySteps.map((step, idx) => {
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
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 text-sm font-black ${
                        active ? 'border-navy bg-gold text-navy' : 'border-navy/20 bg-cream text-navy-light'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-sm sm:text-base">{step}</span>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {stepError && (
              <p role="alert" className="text-sm font-semibold text-coral-500">{stepError}</p>
            )}
          </div>
        ) : (
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
          <Button type="button" variant="ghost" onClick={() => navigate('/task')}>
            Edit task
          </Button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleStartSession}
            disabled={aiLoading && isGuided}
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
