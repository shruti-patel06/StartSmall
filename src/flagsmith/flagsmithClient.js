import flagsmith from '@flagsmith/flagsmith';
import { FLAGSMITH_CONFIG } from './experimentConfig';

export function isFlagsmithConfigured() {
  return Boolean(
    FLAGSMITH_CONFIG.environmentKey &&
      FLAGSMITH_CONFIG.environmentKey !== 'your_flagsmith_environment_key_here'
  );
}

export function getFlagsmithOptions(identity) {
  return {
    environmentID: FLAGSMITH_CONFIG.environmentKey,
    enableEvents: true,
    cacheFlags: true,
    ...(identity ? { identity } : {}),
    onError: (err) => {
      if (import.meta.env.DEV) {
        console.warn('[Flagsmith] Initialization or fetch error:', err);
      }
    },
  };
}

export { flagsmith };
