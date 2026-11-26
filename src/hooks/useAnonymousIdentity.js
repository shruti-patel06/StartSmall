import { useState, useCallback } from 'react';
import { getItem, setItem, STORAGE_KEYS } from '../services/storageService';

function generateFallbackUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useAnonymousIdentity() {
  const [anonymousUserId, setAnonymousUserId] = useState(() => {
    return getItem(STORAGE_KEYS.USER_ID) || null;
  });

  const ensureIdentity = useCallback(() => {
    let existing = getItem(STORAGE_KEYS.USER_ID);
    if (!existing) {
      existing = generateFallbackUUID();
      setItem(STORAGE_KEYS.USER_ID, existing);
    }
    setAnonymousUserId(existing);
    return existing;
  }, []);

  return {
    anonymousUserId,
    ensureIdentity,
  };
}
