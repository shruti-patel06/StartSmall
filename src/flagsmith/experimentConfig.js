export const FLAGSMITH_CONFIG = {
  environmentKey: import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_KEY || '',
  experimentFlagKey: 'study_start_flow',
  experimentName: 'study_start_activation_experiment',
  loadTimeoutMs: 3000,
};
