import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlags } from '@flagsmith/flagsmith/react';
import { useSession } from '../context/SessionContext';
import { FLAGS, MUSIC_VARIANTS } from '../flagsmith/flags';
import { EXPERIMENT_EVENTS, FOCUS_DURATION_SECONDS } from '../constants/experimentEvents';
import { useFocusTimer } from '../hooks/useFocusTimer';
import { useStudyMusic } from '../hooks/useStudyMusic';
import { useFullscreen } from '../hooks/useFullscreen';
import { MUSIC_LABELS } from '../services/musicService';
import { motivationalFramingTemplate } from '../prompts/templates';
import { Layout } from '../components/Layout';
import { Timer } from '../components/Timer';
import { Button } from '../components/Button';
import { FlagIcon } from '../components/QuestIcons';

export function FocusSessionPage() {
  const navigate = useNavigate();
  const { session, updateSession, experimentVariant, trackEvent } = useSession();
  const startedRef = useRef(false);

  useEffect(() => {
    if (!session.taskText) navigate('/task', { replace: true });
  }, [session.taskText, navigate]);

  // ── Feature flags ─────────────────────────────────────────────────────────
  const featureFlags = useFlags([FLAGS.FULLSCREEN_FOCUS, FLAGS.STUDY_MUSIC]);
  const fullscreenEnabled = featureFlags[FLAGS.FULLSCREEN_FOCUS]?.enabled ?? false;
  const flagMusicVariant =
    (session.studyMusicType && session.studyMusicType !== MUSIC_VARIANTS.OFF
      ? session.studyMusicType
      : null) ||
    featureFlags[FLAGS.STUDY_MUSIC]?.value ||
    MUSIC_VARIANTS.OFF;

  const [activeMusicType, setActiveMusicType] = useState(flagMusicVariant);

  useEffect(() => {
    if (flagMusicVariant && flagMusicVariant !== MUSIC_VARIANTS.OFF) {
      setActiveMusicType((prev) =>
        prev === MUSIC_VARIANTS.OFF ? flagMusicVariant : prev
      );
    }
  }, [flagMusicVariant]);

  // ── Hooks ─────────────────────────────────────────────────────────────────
  const { elementRef, enterFullscreen, exitFullscreen } = useFullscreen();
  const music = useStudyMusic({ musicType: activeMusicType, autoStart: false });

  // Motivational framing for CTA (can be driven by flag in future)
  const framing = motivationalFramingTemplate({
    variant: 'neutral',
    taskText: session.taskText || '',
    category: session.taskCategory || '',
  });

  const handleTimerStart = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;

    trackEvent(EXPERIMENT_EVENTS.FOCUS_SESSION_STARTED);

    // Enter fullscreen if flag is on
    if (fullscreenEnabled) {
      await enterFullscreen();
    }

    // Start music (requires user gesture — this is inside the gesture handler chain)
    if (activeMusicType !== MUSIC_VARIANTS.OFF) {
      music.play(activeMusicType);
    }
  }, [trackEvent, fullscreenEnabled, enterFullscreen, activeMusicType, music]);

  const handleTimerComplete = useCallback(() => {
    trackEvent(EXPERIMENT_EVENTS.FOCUS_SESSION_COMPLETED);
    updateSession({ timeSpentSeconds: FOCUS_DURATION_SECONDS });
    music.stop();
    exitFullscreen();
  }, [trackEvent, updateSession, music, exitFullscreen]);

  const { status, remainingSeconds, progressPercent, start, pause, reset } =
    useFocusTimer({
      durationSeconds: FOCUS_DURATION_SECONDS,
      onStart: handleTimerStart,
      onComplete: handleTimerComplete,
    });

  const handleMusicModeChange = useCallback(
    (nextMode) => {
      setActiveMusicType(nextMode);
      updateSession({ studyMusicType: nextMode });
      music.switchMode(nextMode);
    },
    [updateSession, music]
  );

  // Exit fullscreen if user resets
  const handleReset = useCallback(() => {
    music.stop();
    exitFullscreen();
    startedRef.current = false;
    reset();
  }, [music, exitFullscreen, reset]);

  // Exit fullscreen + stop music on early end
  const handleEndEarly = useCallback(() => {
    const elapsedSeconds =
      status === 'idle' ? 0 : Math.max(1, FOCUS_DURATION_SECONDS - remainingSeconds);
    updateSession({ timeSpentSeconds: elapsedSeconds });
    music.stop();
    exitFullscreen();
    navigate('/feedback');
  }, [status, remainingSeconds, updateSession, music, exitFullscreen, navigate]);

  if (!session.taskText) return null;

  return (
    <div ref={elementRef} className="min-h-screen bg-quest-grid flex flex-col">
      <Layout showStep={3}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white border-2 border-navy rounded-3xl p-5 xs:p-6 sm:p-8 shadow-[0_6px_0_#2D3436] space-y-6 sm:space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-coral-500">
              {status === 'running'
                ? 'Survive the first 60 seconds. It gets easier.'
                : 'Just focus on this one thing'}
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

          {/* Music mode switcher & volume controls */}
          <AnimatePresence>
            {flagMusicVariant !== MUSIC_VARIANTS.OFF && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-cream border border-navy/15 rounded-2xl px-4 py-3 space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-navy">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        music.isPlaying
                          ? 'bg-mint animate-pulse-soft'
                          : 'bg-navy-muted'
                      }`}
                    />
                    <span>{MUSIC_LABELS[activeMusicType]}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={music.isMuted ? 0 : music.volume}
                      onChange={(e) => music.changeVolume(Number(e.target.value))}
                      className="w-20 sm:w-28 accent-coral-400"
                      aria-label="Music volume"
                    />
                    <button
                      type="button"
                      onClick={music.toggleMute}
                      className="text-sm font-bold text-navy-light hover:text-navy"
                      aria-label={music.isMuted ? 'Unmute' : 'Mute'}
                    >
                      {music.isMuted ? '🔇' : '🔊'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: MUSIC_VARIANTS.BROWN_NOISE, label: 'Brown noise' },
                    { id: MUSIC_VARIANTS.LOFI, label: 'Lo-fi chords' },
                    { id: MUSIC_VARIANTS.BINAURAL, label: '40Hz Binaural' },
                    { id: MUSIC_VARIANTS.OFF, label: 'Off' },
                  ].map((mode) => {
                    const active = activeMusicType === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => handleMusicModeChange(mode.id)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${
                          active
                            ? 'border-navy bg-gold-light text-navy'
                            : 'border-navy/20 bg-white text-navy-light hover:border-navy'
                        }`}
                      >
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timer */}
          <Timer
            status={status}
            remainingSeconds={remainingSeconds}
            progressPercent={progressPercent}
            ctaLabel={framing.cta}
            onStart={start}
            onPause={pause}
            onReset={handleReset}
          />

          {/* Completion */}
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
              <p className="text-sm text-navy-light">You started when you didn't feel like it. That's what discipline looks like.</p>
              <Button variant="mint" size="lg" onClick={() => navigate('/feedback')}>
                Continue to check-in
              </Button>
            </motion.div>
          ) : (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleEndEarly}
                className="text-xs font-semibold text-navy-light hover:text-navy underline underline-offset-4"
              >
                End early and check in
              </button>
            </div>
          )}
        </motion.div>
      </Layout>
    </div>
  );
}
