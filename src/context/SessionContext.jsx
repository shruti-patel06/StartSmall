import { createContext, useContext, useState, useCallback } from 'react';
import { useAnonymousIdentity } from '../hooks/useAnonymousIdentity';
import {
  getPhase1Variant,
  setPhase1Variant,
  trackPhase1Event,
} from '../services/experimentService';
import { getJSON, setJSON, STORAGE_KEYS } from '../services/storageService';
import { FOCUS_DURATION_SECONDS } from '../constants/experimentEvents';

const SessionContext = createContext(null);

const INITIAL_SESSION = {
  taskText: '',
  taskCategory: '',
  selectedMicroStep: '',
  timeSpentSeconds: FOCUS_DURATION_SECONDS,
  feedbackResponse: '',
  feedbackNote: '',
  feedbackSubmitted: false,
};

export function SessionProvider({ children }) {
  const { anonymousUserId, ensureIdentity } = useAnonymousIdentity();
  const [experimentVariant, setExperimentVariant] = useState(() =>
    getPhase1Variant()
  );
  const [session, setSession] = useState(() => {
    return getJSON(STORAGE_KEYS.SESSION_STATE, INITIAL_SESSION, 'sessionStorage');
  });

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

  const switchVariantForPreview = useCallback((variant) => {
    setPhase1Variant(variant);
    setExperimentVariant(variant);
  }, []);

  const saveLocalFeedback = useCallback(
    (responseId, note) => {
      const entry = {
        id: Date.now(),
        anonymousUserId,
        taskCategory: session.taskCategory,
        selectedMicroStep: session.selectedMicroStep || null,
        experimentVariant,
        responseId,
        note: note.trim(),
        createdAt: new Date().toISOString(),
      };
      const existing = getJSON(STORAGE_KEYS.FEEDBACK_LOG, [], 'localStorage');
      setJSON(STORAGE_KEYS.FEEDBACK_LOG, [...existing, entry], 'localStorage');

      updateSession({
        feedbackResponse: responseId,
        feedbackNote: note.trim(),
        feedbackSubmitted: true,
      });
    },
    [anonymousUserId, session.taskCategory, session.selectedMicroStep, experimentVariant, updateSession]
  );

  return (
    <SessionContext.Provider
      value={{
        anonymousUserId,
        ensureIdentity,
        experimentVariant,
        switchVariantForPreview,
        session,
        updateSession,
        resetForNewTask,
        saveLocalFeedback,
        trackEvent: trackPhase1Event,
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
