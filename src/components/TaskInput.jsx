export function TaskInput({ value, onChange, error, maxLength = 200 }) {
  const remaining = maxLength - value.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="study-task-input"
          className="block text-sm font-bold text-navy"
        >
          Your study task
        </label>
        <span
          className={`text-xs font-semibold ${
            remaining <= 20 ? 'text-coral-500' : 'text-navy-light'
          }`}
        >
          {value.length}/{maxLength}
        </span>
      </div>
      <textarea
        id="study-task-input"
        rows={3}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Example: Study Operating Systems — Memory Management"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'task-input-error' : undefined}
        className={`w-full rounded-2xl border-2 bg-white px-4 py-3 text-base text-navy placeholder:text-navy-muted transition-shadow focus:outline-none focus:ring-4 ${
          error
            ? 'border-coral-500 focus:ring-coral-200'
            : 'border-navy shadow-[0_3px_0_#2D3436] focus:ring-coral-100'
        }`}
      />
      {error && (
        <p id="task-input-error" role="alert" className="text-sm font-semibold text-coral-500">
          {error}
        </p>
      )}
    </div>
  );
}
