import { PromptBuilder } from '../prompts/promptBuilder';
import { getMicroStepsForCategory } from './taskSuggestionService';

const GROK_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROK_API_KEY = import.meta.env.VITE_GROK_API_KEY?.trim();
const REQUEST_TIMEOUT_MS = 8000;

function isAiConfigured() {
  return Boolean(GROK_API_KEY && GROK_API_KEY !== 'your_grok_api_key_here');
}

/**
 * Calls the Grok API with a given payload.
 * Returns parsed JSON content, or throws on failure.
 */
async function callGrok(payload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from Grok');

    return JSON.parse(content);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Generates 3 AI-powered micro-steps for the current task.
 * Uses memory context when hasMemory=true and sessionHistory is provided.
 * Falls back to static templates on any failure.
 *
 * @param {object} opts
 * @param {string} opts.taskText
 * @param {string} opts.category
 * @param {Array}  opts.sessionHistory - from memoryService.getRecentSessions()
 * @param {boolean} opts.hasMemory - whether memory_enabled flag is on
 * @returns {Promise<{ steps: string[], source: 'ai'|'fallback' }>}
 */
export async function generateMicroSteps({ taskText, category, sessionHistory = [], hasMemory = false }) {
  if (!isAiConfigured()) {
    return { steps: getMicroStepsForCategory(category), source: 'fallback' };
  }

  try {
    const payload = PromptBuilder.microStep({ taskText, category, sessionHistory, hasMemory });
    const result = await callGrok(payload);

    if (Array.isArray(result?.steps) && result.steps.length >= 3) {
      return { steps: result.steps.slice(0, 3), source: 'ai' };
    }

    throw new Error('Invalid steps format in Grok response');
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[aiService] generateMicroSteps failed, falling back:', err.message);
    }
    return { steps: getMicroStepsForCategory(category), source: 'fallback' };
  }
}

/**
 * Generates one icebreaker sentence based on task + session memory.
 * Returns null on any failure — icebreaker is an enhancement, never required.
 *
 * @param {object} opts
 * @param {string} opts.taskText
 * @param {string} opts.category
 * @param {Array}  opts.sessionHistory
 * @returns {Promise<string|null>}
 */
export async function generateIcebreaker({ taskText, category, sessionHistory = [] }) {
  if (!isAiConfigured() || sessionHistory.length === 0) return null;

  try {
    const payload = PromptBuilder.icebreaker({ taskText, category, sessionHistory });
    const result = await callGrok(payload);

    if (typeof result?.icebreaker === 'string' && result.icebreaker.trim()) {
      return result.icebreaker.trim();
    }

    return null;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[aiService] generateIcebreaker failed silently:', err.message);
    }
    return null;
  }
}
