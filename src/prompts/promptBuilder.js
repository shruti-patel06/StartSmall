import {
  systemPromptTemplate,
  microStepNoMemoryTemplate,
  microStepWithMemoryTemplate,
  icebreakerTemplate,
  formatSessionHistory,
} from './templates';

/**
 * Assembles a full Grok API request payload from named template + runtime data.
 * Never hardcodes prompt strings — always delegates to templates.js.
 */
export const PromptBuilder = {
  /**
   * Builds the micro-step generation payload.
   * @param {object} data - { taskText, category, sessionHistory?, hasMemory }
   */
  microStep({ taskText, category, sessionHistory = [], hasMemory = false }) {
    const historyBlock = formatSessionHistory(sessionHistory);
    const useMemory = hasMemory && historyBlock;

    const patternSummary = useMemory
      ? buildPatternSummary(sessionHistory)
      : null;

    const userPrompt = useMemory
      ? microStepWithMemoryTemplate({ taskText, category, historyBlock, patternSummary })
      : microStepNoMemoryTemplate({ taskText, category });

    return {
      model: 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: systemPromptTemplate() },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 650,
      response_format: { type: 'json_object' },
    };
  },

  /**
   * Builds the icebreaker generation payload.
   * @param {object} data - { taskText, category, sessionHistory }
   */
  icebreaker({ taskText, category, sessionHistory = [] }) {
    const historyBlock = formatSessionHistory(sessionHistory);
    const { attemptCount, lastOutcome } = analyzeTaskHistory(taskText, sessionHistory);

    const userPrompt = icebreakerTemplate({
      taskText,
      category,
      historyBlock,
      attemptCount,
      lastOutcome,
    });

    return {
      model: 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: systemPromptTemplate() },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.75,
      max_tokens: 450,
      response_format: { type: 'json_object' },
    };
  },
};

// ─── Internal helpers ─────────────────────────────────────────────────────────

function buildPatternSummary(sessions) {
  if (!sessions || sessions.length === 0) return 'No patterns detected yet.';

  const categoryCount = {};
  let stuckCount = 0;
  let completedCount = 0;

  sessions.forEach((s) => {
    if (s.taskCategory) {
      categoryCount[s.taskCategory] = (categoryCount[s.taskCategory] || 0) + 1;
    }
    if (s.responseId === 'got_distracted_or_stuck') stuckCount++;
    if (s.responseId === 'completed_small_task') completedCount++;
  });

  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
  const total = sessions.length;

  const lines = [];
  if (topCategory) {
    lines.push(`Most studied category: ${topCategory[0]} (${topCategory[1]} of ${total} sessions)`);
  }
  if (stuckCount > 0) {
    lines.push(`Got stuck in ${stuckCount} of ${total} sessions (${Math.round((stuckCount / total) * 100)}%)`);
  }
  if (completedCount > 0) {
    lines.push(`Completed task in ${completedCount} of ${total} sessions`);
  }

  return lines.length > 0 ? lines.join('\n') : 'Not enough data to detect patterns yet.';
}

function analyzeTaskHistory(currentTaskText, sessions) {
  if (!sessions || sessions.length === 0) {
    return { attemptCount: 0, lastOutcome: null };
  }

  const keyword = currentTaskText.toLowerCase().split(' ').slice(0, 3).join(' ');

  const related = sessions.filter(
    (s) => s.taskText && s.taskText.toLowerCase().includes(keyword.split(' ')[0])
  );

  const lastOutcomeMap = {
    completed_small_task: 'successfully completed',
    made_some_progress: 'partial progress made',
    got_distracted_or_stuck: 'got stuck or distracted',
  };

  return {
    attemptCount: related.length,
    lastOutcome: related.length > 0
      ? lastOutcomeMap[related[related.length - 1].responseId] || null
      : null,
  };
}
