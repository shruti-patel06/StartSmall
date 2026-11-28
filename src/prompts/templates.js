// All prompt templates as pure functions — no hardcoded strings anywhere.
// Each template receives a data object and returns a formatted string.

/**
 * Formats session history entries into a readable context block.
 * Used by both micro-step and icebreaker templates.
 */
export function formatSessionHistory(sessions) {
  if (!sessions || sessions.length === 0) return null;

  return sessions
    .slice(-5) // Last 5 sessions only — enough context, not overwhelming
    .map((s, i) => {
      const daysAgo = Math.floor(
        (Date.now() - new Date(s.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      const when =
        daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;
      const outcome =
        s.responseId === 'completed_small_task'
          ? 'completed successfully ✓'
          : s.responseId === 'made_some_progress'
          ? 'made some progress'
          : 'got stuck or distracted ✗';
      const duration = s.timeSpentSeconds
        ? `${Math.round(s.timeSpentSeconds / 60)} min`
        : 'unknown duration';

      return `- ${when}: "${s.taskText || 'task not recorded'}" (${s.taskCategory || 'unknown category'}) — ${outcome} after ${duration}${
        s.selectedMicroStep ? `, started with: "${s.selectedMicroStep}"` : ''
      }`;
    })
    .join('\n');
}

/**
 * Builds the system role context for all Grok calls.
 * Keeps the AI persona consistent across all prompts.
 */
export function systemPromptTemplate() {
  return `You are a focused, evidence-based study coach embedded in a productivity app called StartSmall.
Your role is to help students overcome the psychological barrier of starting a study session.
You understand that procrastination is emotional avoidance, not laziness.
You speak directly, specifically, and briefly. Never use generic encouragement.
You always reference the actual task the student is working on.
Never use placeholder text or examples — always respond to the real data provided.`;
}

/**
 * Micro-step prompt template — no memory variant.
 * Used when memory_enabled flag is false or no history exists.
 */
export function microStepNoMemoryTemplate({ taskText, category }) {
  return `A student needs to start this study task: "${taskText}"
Task category: ${category}

Generate exactly 3 micro-steps for this specific task.

Rules:
- Each step must be specific to the exact topic/subject in the task
- Each step must be completable in under 2 minutes
- Each step must be a concrete physical action (open, write, draw, list, find, read)
- Never use generic advice like "review your notes" — reference the actual subject
- Steps should follow a progression: orient → engage → produce

Respond ONLY with valid JSON in this exact format:
{
  "steps": ["step one", "step two", "step three"]
}`;
}

/**
 * Micro-step prompt template — with memory variant.
 * Used when memory_enabled flag is true and history exists.
 */
export function microStepWithMemoryTemplate({ taskText, category, historyBlock, patternSummary }) {
  return `A student needs to start this study task: "${taskText}"
Task category: ${category}

THEIR RECENT STUDY HISTORY:
${historyBlock}

DETECTED PATTERNS:
${patternSummary}

Generate exactly 3 micro-steps tailored to this student's specific history and struggles.

Rules:
- Reference where they previously got stuck if relevant — help them bypass that exact point
- Each step must be specific to the exact topic in their current task
- Each step must be a concrete physical action completable in under 2 minutes
- If they've attempted this topic before and struggled, the first step should be different from what they tried last time
- Steps should follow a progression: orient → engage → produce

Respond ONLY with valid JSON in this exact format:
{
  "steps": ["step one", "step two", "step three"]
}`;
}

/**
 * Icebreaker prompt template — always uses memory when available.
 * Generates ONE sentence that acknowledges the emotional barrier and reframes the session.
 */
export function icebreakerTemplate({ taskText, category, historyBlock, attemptCount, lastOutcome }) {
  const attemptContext =
    attemptCount > 1
      ? `They have attempted similar tasks ${attemptCount} times recently.`
      : 'This is their first attempt at this topic.';

  const outcomeContext = lastOutcome
    ? `Their last session on this topic ended with: ${lastOutcome}.`
    : 'No prior outcome data for this topic.';

  return `A student is about to start: "${taskText}" (${category})

${attemptContext}
${outcomeContext}

THEIR RECENT HISTORY:
${historyBlock || 'No prior history available.'}

Write ONE icebreaker message (1-2 sentences maximum) that:
1. Acknowledges the specific emotional or cognitive barrier they face with this task
2. Reframes this session using a specific psychological angle (Zeigarnik, self-efficacy, scope reduction, or commitment)
3. References the actual task — never generic encouragement

The message should feel like a knowledgeable friend speaking, not a motivational poster.

Respond ONLY with valid JSON in this exact format:
{
  "icebreaker": "your message here"
}`;
}

/**
 * Motivational framing template for the timer CTA.
 * Returns framing copy based on the motivational_framing flag value.
 */
export function motivationalFramingTemplate({ variant, taskText, category }) {
  const frames = {
    neutral: {
      cta: 'Start timer',
      sub: 'Begin your five-minute session.',
    },
    identity: {
      cta: 'Show up as a focused student',
      sub: `The kind of person who studies ${category} actually opens it.`,
    },
    progress: {
      cta: 'Move five minutes closer',
      sub: `Five minutes on "${taskText.slice(0, 40)}${taskText.length > 40 ? '…' : ''}" adds up.`,
    },
  };

  return frames[variant] || frames.neutral;
}
