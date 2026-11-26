import { useState, useEffect, useRef, useCallback } from 'react';
import { FOCUS_DURATION_SECONDS } from '../constants/experimentEvents';

/**
 * Focus timer using an absolute end timestamp to prevent drift in background tabs.
 */
export function useFocusTimer({
  durationSeconds = FOCUS_DURATION_SECONDS,
  onStart,
  onComplete,
} = {}) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'running' | 'paused' | 'completed'
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);

  const endTimestampRef = useRef(null);
  const pausedRemainingMsRef = useRef(durationSeconds * 1000);
  const hasStartedOnceRef = useRef(false);
  const hasCompletedRef = useRef(false);

  const onStartRef = useRef(onStart);
  const onCompleteRef = useRef(onComplete);
  onStartRef.current = onStart;
  onCompleteRef.current = onComplete;

  const syncRemaining = useCallback(() => {
    if (!endTimestampRef.current) return;
    const msLeft = Math.max(0, endTimestampRef.current - Date.now());
    const secsLeft = Math.ceil(msLeft / 1000);
    setRemainingSeconds(secsLeft);

    if (msLeft <= 0 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      endTimestampRef.current = null;
      setStatus('completed');
      setRemainingSeconds(0);
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }
  }, []);

  useEffect(() => {
    if (status !== 'running') return;

    const intervalId = setInterval(syncRemaining, 250);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncRemaining();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', syncRemaining);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', syncRemaining);
    };
  }, [status, syncRemaining]);

  const start = useCallback(() => {
    if (status === 'completed') return;

    const msToRun =
      status === 'paused'
        ? pausedRemainingMsRef.current
        : durationSeconds * 1000;

    endTimestampRef.current = Date.now() + msToRun;
    setStatus('running');

    if (!hasStartedOnceRef.current) {
      hasStartedOnceRef.current = true;
      if (onStartRef.current) {
        onStartRef.current();
      }
    }
  }, [status, durationSeconds]);

  const pause = useCallback(() => {
    if (status !== 'running' || !endTimestampRef.current) return;
    const msLeft = Math.max(0, endTimestampRef.current - Date.now());
    pausedRemainingMsRef.current = msLeft;
    endTimestampRef.current = null;
    setRemainingSeconds(Math.ceil(msLeft / 1000));
    setStatus('paused');
  }, [status]);

  const reset = useCallback(() => {
    endTimestampRef.current = null;
    pausedRemainingMsRef.current = durationSeconds * 1000;
    hasCompletedRef.current = false;
    setRemainingSeconds(durationSeconds);
    setStatus('idle');
  }, [durationSeconds]);

  const elapsedSeconds = durationSeconds - remainingSeconds;
  const progressPercent = Math.min(
    100,
    Math.max(0, (elapsedSeconds / durationSeconds) * 100)
  );

  return {
    status,
    remainingSeconds,
    elapsedSeconds,
    progressPercent,
    start,
    pause,
    reset,
  };
}
