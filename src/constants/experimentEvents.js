export const EXPERIMENT_FLAG_KEY = 'study_start_flow';
export const EXPERIMENT_NAME = 'study_start_activation_experiment';

export const EXPERIMENT_VARIANTS = {
  CONTROL: 'control',
  GUIDED: 'guided',
};

export const EXPERIMENT_EVENTS = {
  TASK_SUBMITTED: 'task_submitted',
  MICRO_STEP_SELECTED: 'micro_step_selected',
  FOCUS_SESSION_STARTED: 'focus_session_started',
  FOCUS_SESSION_COMPLETED: 'focus_session_completed',
  FOCUS_SESSION_FEEDBACK_SUBMITTED: 'focus_session_feedback_submitted',
};

export const FOCUS_DURATION_SECONDS = 300; // 5 minutes
