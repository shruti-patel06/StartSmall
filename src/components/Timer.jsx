import { motion } from 'framer-motion';
import { Button } from './Button';

function formatMMSS(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function Timer({
  status,
  remainingSeconds,
  progressPercent,
  onStart,
  onPause,
  onReset,
}) {
  const radius = 96;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Circular countdown ring */}
      <div className="relative flex items-center justify-center w-56 h-56 sm:w-64 sm:h-64">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 220 220"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="#FFFFFF"
            stroke="#E8DCD0"
            strokeWidth="14"
          />
          {/* Progress */}
          <motion.circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke={status === 'completed' ? '#6BCB77' : '#FF6B6B'}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.3, ease: 'linear' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-5xl sm:text-6xl font-black tracking-tight text-navy tabular-nums"
            aria-live="off"
          >
            {formatMMSS(remainingSeconds)}
          </span>
          <span className="mt-1.5 text-xs font-bold uppercase tracking-widest text-navy-light">
            {status === 'idle' && 'Ready'}
            {status === 'running' && 'Focusing'}
            {status === 'paused' && 'Paused'}
            {status === 'completed' && 'Done!'}
          </span>
        </div>
      </div>

      {/* Screen-reader friendly milestone announcements */}
      <div className="sr-only" aria-live="polite">
        {status === 'running' && 'Focus timer started.'}
        {status === 'paused' && 'Focus timer paused.'}
        {status === 'completed' && 'Five-minute focus session completed.'}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {(status === 'idle' || status === 'paused') && (
          <Button variant="primary" size="lg" onClick={onStart}>
            {status === 'paused' ? 'Resume' : 'Start timer'}
          </Button>
        )}

        {status === 'running' && (
          <Button variant="gold" size="lg" onClick={onPause}>
            Pause
          </Button>
        )}

        {status !== 'idle' && status !== 'completed' && (
          <Button variant="secondary" size="lg" onClick={onReset}>
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
