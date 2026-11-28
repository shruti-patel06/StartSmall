import { useCallback, useRef } from 'react';

/**
 * Wraps the browser Fullscreen API.
 * Enters fullscreen on a given element (defaults to documentElement).
 */
export function useFullscreen() {
  const elementRef = useRef(null);

  const enterFullscreen = useCallback(async () => {
    const el = elementRef.current || document.documentElement;
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      }
    } catch {
      // Fullscreen may be blocked by browser policy — fail silently
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.webkitFullscreenElement) {
        await document.webkitExitFullscreen?.();
      }
    } catch {}
  }, []);

  const isFullscreen = useCallback(() => {
    return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
  }, []);

  return { elementRef, enterFullscreen, exitFullscreen, isFullscreen };
}
