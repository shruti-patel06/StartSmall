import { getJSON, setJSON, STORAGE_KEYS } from './storageService';

const MAX_HISTORY = 20; // Keep last 20 sessions in memory

/**
 * Reads all stored sessions from localStorage.
 * Sessions are stored by the CompletionPage / FeedbackPage flow.
 */
export function getSessionHistory() {
  return getJSON(STORAGE_KEYS.FEEDBACK_LOG, [], 'localStorage');
}

/**
 * Returns the last N sessions, most recent first.
 */
export function getRecentSessions(n = 5) {
  const all = getSessionHistory();
  return [...all].reverse().slice(0, n);
}

/**
 * Adds or updates session context (called after timer completion with full session data).
 * Keeps history capped at MAX_HISTORY entries.
 */
export function appendSessionToMemory(sessionData) {
  const existing = getSessionHistory();
  const updated = [...existing, { ...sessionData, createdAt: new Date().toISOString() }];
  // Keep only the last MAX_HISTORY sessions
  const trimmed = updated.slice(-MAX_HISTORY);
  setJSON(STORAGE_KEYS.FEEDBACK_LOG, trimmed, 'localStorage');
}

/**
 * Detects the most common study category for this user.
 */
export function getDominantCategory(sessions) {
  if (!sessions || sessions.length === 0) return null;
  const counts = {};
  sessions.forEach((s) => {
    if (s.taskCategory) counts[s.taskCategory] = (counts[s.taskCategory] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

/**
 * Returns whether the user has enough history to use memory-enhanced prompts.
 * Requires at least 1 prior completed session.
 */
export function hasEnoughHistoryForMemory(sessions) {
  return sessions && sessions.length >= 1;
}

/**
 * Returns a session summary to show on the CompletionPage streak display.
 */
export function getSessionStats() {
  const sessions = getSessionHistory();
  const total = sessions.length;
  const completed = sessions.filter((s) => s.responseId === 'completed_small_task').length;
  const streak = computeStreak(sessions);
  return { total, completed, streak };
}

function computeStreak(sessions) {
  if (!sessions || sessions.length === 0) return 0;
  const days = new Set(
    sessions.map((s) => {
      const d = new Date(s.createdAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (days.has(key)) streak++;
    else if (i > 0) break;
  }
  return streak;
}
