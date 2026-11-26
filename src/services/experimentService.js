import { EXPERIMENT_VARIANTS } from '../constants/experimentEvents';
import { getItem, setItem, STORAGE_KEYS } from './storageService';

/**
 * Phase 1 stub for Flagsmith experiment variation.
 * In Phase 2, this will be replaced by @flagsmith/flagsmith `useExperiment("study_start_flow")`.
 * Supports ?variant=control or ?variant=guided in URL, or local dev toggle for testing both UIs.
 */
export function getPhase1Variant() {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const urlVariant = params.get('variant');
    if (
      urlVariant === EXPERIMENT_VARIANTS.CONTROL ||
      urlVariant === EXPERIMENT_VARIANTS.GUIDED
    ) {
      setItem(STORAGE_KEYS.VARIANT_OVERRIDE, urlVariant);
      return urlVariant;
    }
  }

  const saved = getItem(STORAGE_KEYS.VARIANT_OVERRIDE);
  if (
    saved === EXPERIMENT_VARIANTS.CONTROL ||
    saved === EXPERIMENT_VARIANTS.GUIDED
  ) {
    return saved;
  }

  // Default to guided in Phase 1 so the micro-step experience is easy to preview
  return EXPERIMENT_VARIANTS.GUIDED;
}

export function setPhase1Variant(variant) {
  if (
    variant === EXPERIMENT_VARIANTS.CONTROL ||
    variant === EXPERIMENT_VARIANTS.GUIDED
  ) {
    setItem(STORAGE_KEYS.VARIANT_OVERRIDE, variant);
  }
}

/**
 * Phase 1 stub for event tracking (no-op logger).
 * Phase 2 will wire this to flagsmith.trackEvent with deduplication.
 */
export function trackPhase1Event(eventName) {
  if (import.meta.env.DEV) {
    console.debug(`[Phase 1 Stub Event] ${eventName}`);
  }
}
