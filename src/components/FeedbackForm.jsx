import { useState } from 'react';
import { motion } from 'framer-motion';
import { FEEDBACK_OPTIONS } from '../constants/categories';
import { Button } from './Button';

export function FeedbackForm({
  onSubmitFinish,
  onStartAnother,
  alreadySubmitted = false,
}) {
  const [selectedOption, setSelectedOption] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (alreadySubmitted) return;

    if (!selectedOption) {
      setError('Please pick how the session went.');
      return;
    }

    setError('');
    onSubmitFinish(selectedOption, note);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        role="radiogroup"
        aria-label="Session outcome"
        className="space-y-3"
      >
        {FEEDBACK_OPTIONS.map((option) => {
          const isSelected = selectedOption === option.id;
          return (
            <motion.button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => {
                setSelectedOption(option.id);
                if (error) setError('');
              }}
              whileHover={{ y: -1 }}
              whileTap={{ y: 1 }}
              className={`w-full flex items-center gap-3.5 rounded-2xl border-2 px-4 py-3.5 text-left font-semibold transition-all ${
                isSelected
                  ? 'border-navy bg-gold-light text-navy shadow-[0_4px_0_#2D3436]'
                  : 'border-navy/25 bg-white text-navy hover:border-navy'
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  isSelected
                    ? 'border-navy bg-coral-400'
                    : 'border-navy/40 bg-white'
                }`}
              >
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-white" />
                )}
              </span>
              <span>{option.label}</span>
            </motion.button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="text-sm font-semibold text-coral-500">
          {error}
        </p>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="feedback-difficulty"
            className="block text-sm font-bold text-navy"
          >
            What made it difficult to continue?{' '}
            <span className="font-normal text-navy-light">(Optional)</span>
          </label>
          <span className="text-xs font-semibold text-navy-light">
            {note.length}/300
          </span>
        </div>
        <textarea
          id="feedback-difficulty"
          rows={3}
          maxLength={300}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g., Needed to find my notes first, phone notifications..."
          className="w-full rounded-2xl border-2 border-navy/30 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy-muted focus:border-navy focus:outline-none focus:ring-4 focus:ring-coral-100"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={alreadySubmitted}
          className="flex-1"
        >
          Finish session
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onStartAnother}
          className="flex-1"
        >
          Start another session
        </Button>
      </div>
    </form>
  );
}
