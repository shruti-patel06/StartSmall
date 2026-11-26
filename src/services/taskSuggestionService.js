const MICRO_STEP_TEMPLATES = {
  reading: [
    'Open your lecture notes.',
    'Read the first two pages.',
    'Write down three important concepts.',
  ],
  problem_solving: [
    'Read one practice question.',
    'Identify the information provided.',
    'Try solving the first step.',
  ],
  coding: [
    'Open your code editor.',
    'Write a small test case.',
    'Implement one basic function.',
  ],
  revision: [
    'Open your revision notes.',
    'Recall three concepts without looking.',
    'Review one previously incorrect answer.',
  ],
};

/**
 * Returns deterministic, predefined micro-step suggestions for a given task category.
 */
export function getMicroStepsForCategory(categoryId) {
  return MICRO_STEP_TEMPLATES[categoryId] || MICRO_STEP_TEMPLATES.reading;
}
