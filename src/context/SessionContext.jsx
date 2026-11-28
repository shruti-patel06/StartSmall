import { createContext, useContext, useState, useCallback } from 'react';
import { useFlagsmith } from '@flagsmith/flagsmith/react';
import { useAnonymousIdentity } from '../hooks/useAnonymousIdentity';
import { isFlagsmithConfigured } from '../flagsmith/flagsmithClient';
import { trackAnalyticsEvent } from '../services/analyticsService';
import { appendSessionToMemory } from '../services/memoryService';
import { getJSON, setJSON, STORAGE_KEYS } from '../services/storageService';
import { MUSIC_VARIANTS } from '../flagsmith/flags';
import {
  EXPERIMENT_VARIANTS,
  FOCUS_DURATION_SECONDS,
} from '../constants/experimentEvents';

const SessionContext = createContext(null);

const INITIAL_SESSION = {
  taskText: '',
  taskCategory: '',
  selectedMicroStep: '',
  studyMusicType: MUSIC_VARIANTS.OFF,
  timeSpentSeconds: FOCUS_DURATION_SECONDS,
  feedbackResponse: '',
  feedbackNote: '',
  feedbackSubmitted: false,
};

export function SessionProvider({ children }) {
  const flagsmith = useFlagsmith();
  const { anonymousUserId, ensureIdentity: ensureLocalIdentity } =
    useAnonymousIdentity();

  const [experimentVariant, setExperimentVariant] = useState(
    EXPERIMENT_VARIANTS.CONTROL
  );
  const [isEnrolledInExperiment, setIsEnrolledInExperiment] = useState(false);

  const [session, setSession] = useState(() => {
    return getJSON(
      STORAGE_KEYS.SESSION_STATE,
      INITIAL_SESSION,
      'sessionStorage'
    );
  });

  const ensureIdentity = useCallback(() => {
    const id = ensureLocalIdentity();
    if (isFlagsmithConfigured() && flagsmith && flagsmith.identity !== id) {
      Promise.resolve(flagsmith.identify(id)).catch((err) => {
        if (import.meta.env.DEV) {
          console.warn('[Flagsmith] Identify failed, continuing safely:', err);
        }
      });
    }
    return id;
  }, [ensureLocalIdentity, flagsmith]);

  const updateSession = useCallback((updates) => {
    setSession((prev) => {
      const next = { ...prev, ...updates };
      setJSON(STORAGE_KEYS.SESSION_STATE, next, 'sessionStorage');
      return next;
    });
  }, []);

  const resetForNewTask = useCallback(() => {
    const fresh = { ...INITIAL_SESSION };
    setSession(fresh);
    setJSON(STORAGE_KEYS.SESSION_STATE, fresh, 'sessionStorage');
  }, []);

  const setExperimentAssignment = useCallback((variant, enrolled) => {
    setExperimentVariant(variant);
    setIsEnrolledInExperiment(Boolean(enrolled));
  }, []);

  const trackEvent = useCallback(
    (eventName) => {
      return trackAnalyticsEvent(eventName, {
        anonymousUserId,
        isEnrolledInExperiment,
      });
    },
    [anonymousUserId, isEnrolledInExperiment]
  );

  const saveLocalFeedback = useCallback(
    (responseId, note) => {
      appendSessionToMemory({
        id: Date.now(),
        anonymousUserId,
        taskText: session.taskText,
        taskCategory: session.taskCategory,
        selectedMicroStep: session.selectedMicroStep || null,
        timeSpentSeconds: session.timeSpentSeconds || FOCUS_DURATION_SECONDS,
        experimentVariant: isEnrolledInExperiment ? experimentVariant : 'fallback',
        responseId,
        note: note.trim(),
      });

      updateSession({
        feedbackResponse: responseId,
        feedbackNote: note.trim(),
        feedbackSubmitted: true,
      });
    },
    [
      anonymousUserId,
      session.taskText,
      session.taskCategory,
      session.selectedMicroStep,
      session.timeSpentSeconds,
      experimentVariant,
      isEnrolledInExperiment,
      updateSession,
    ]
  );

  return (
    <SessionContext.Provider
      value={{
        anonymousUserId,
        ensureIdentity,
        experimentVariant,
        isEnrolledInExperiment,
        setExperimentAssignment,
        session,
        updateSession,
        resetForNewTask,
        saveLocalFeedback,
        trackEvent,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return ctx;
}
