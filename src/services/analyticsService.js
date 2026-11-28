import { flagsmith, isFlagsmithConfigured } from '../flagsmith/flagsmithClient';
import { EXPERIMENT_EVENTS } from '../constants/experimentEvents';
import { getItem, setItem, STORAGE_KEYS } from './storageService';

/**
 * Ensures deduplication markers are tied to the current anonymous identity.
 */
function ensureExperimentIdentityMarker(anonymousUserId) {
  if (!anonymousUserId) return;
  const recordedId = getItem(STORAGE_KEYS.EXPERIMENT_IDENTITY);
  if (recordedId !== anonymousUserId) {
    setItem(STORAGE_KEYS.EXPERIMENT_IDENTITY, anonymousUserId);
  }
}

function hasSentConversion(storageKey) {
  return getItem(storageKey) === 'true';
}

function markConversionSent(storageKey, anonymousUserId) {
  ensureExperimentIdentityMarker(anonymousUserId);
  setItem(storageKey, 'true');
}

/**
 * Tracks an application or experiment event safely without blocking the UI.
 * Never transmits task text, notes, or personal data.
 */
export function trackAnalyticsEvent(
  eventName,
  { anonymousUserId, isEnrolledInExperiment = false } = {}
) {
  if (!isFlagsmithConfigured()) return false;

  // Primary and secondary conversion metrics require valid experiment enrollment
  // and are strictly deduplicated once per anonymous identity.
  if (eventName === EXPERIMENT_EVENTS.FOCUS_SESSION_STARTED) {
    if (!isEnrolledInExperiment) return false;
    if (hasSentConversion(STORAGE_KEYS.PRIMARY_CONVERSION_SENT)) return false;

    try {
      flagsmith.trackEvent(eventName);
      markConversionSent(STORAGE_KEYS.PRIMARY_CONVERSION_SENT, anonymousUserId);
      return true;
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('[Analytics] Failed to track primary conversion:', err);
      }
      return false;
    }
  }

  if (eventName === EXPERIMENT_EVENTS.FOCUS_SESSION_COMPLETED) {
    if (!isEnrolledInExperiment) return false;
    if (hasSentConversion(STORAGE_KEYS.SECONDARY_CONVERSION_SENT)) return false;

    try {
      flagsmith.trackEvent(eventName);
      markConversionSent(STORAGE_KEYS.SECONDARY_CONVERSION_SENT, anonymousUserId);
      return true;
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('[Analytics] Failed to track secondary conversion:', err);
      }
      return false;
    }
  }

  // Supporting application events
  try {
    flagsmith.trackEvent(eventName);
    return true;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn(`[Analytics] Failed to track ${eventName}:`, err);
    }
    return false;
  }
}
