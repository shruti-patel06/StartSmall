const STORAGE_KEYS = {
  USER_ID: 'startsmall_user_id',
  SESSION_STATE: 'startsmall_session_state',
  FEEDBACK_LOG: 'startsmall_feedback_log',
  VARIANT_OVERRIDE: 'startsmall_phase1_variant',
};

function safeGetStorage(storageType = 'localStorage') {
  try {
    const storage = window[storageType];
    const testKey = '__startsmall_test__';
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
}

export function getItem(key, storageType = 'localStorage') {
  const storage = safeGetStorage(storageType);
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function setItem(key, value, storageType = 'localStorage') {
  const storage = safeGetStorage(storageType);
  if (!storage) return false;
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function getJSON(key, fallback = null, storageType = 'localStorage') {
  const raw = getItem(key, storageType);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setJSON(key, value, storageType = 'localStorage') {
  try {
    return setItem(key, JSON.stringify(value), storageType);
  } catch {
    return false;
  }
}

export function removeItem(key, storageType = 'localStorage') {
  const storage = safeGetStorage(storageType);
  if (!storage) return false;
  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export { STORAGE_KEYS };
