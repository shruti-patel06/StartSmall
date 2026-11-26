import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { EXPERIMENT_EVENTS } from '../constants/experimentEvents';
import { Layout } from '../components/Layout';
import { TaskInput } from '../components/TaskInput';
import { CategorySelector } from '../components/CategorySelector';
import { Button } from '../components/Button';

export function TaskEntryPage() {
  const navigate = useNavigate();
  const { session, updateSession, ensureIdentity, trackEvent } = useSession();

  const [taskText, setTaskText] = useState(session.taskText || '');
  const [category, setCategory] = useState(session.taskCategory || '');
  const [taskError, setTaskError] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = taskText.trim();

    let hasError = false;
    if (!trimmed) {
      setTaskError('Please enter a study task to get started.');
      hasError = true;
    } else if (trimmed.length > 200) {
      setTaskError('Keep your task under 200 characters.');
      hasError = true;
    } else {
      setTaskError('');
    }

    if (!category) {
      setCategoryError('Please select one category.');
      hasError = true;
    } else {
      setCategoryError('');
    }

    if (hasError) return;

    ensureIdentity();
    updateSession({
      taskText: trimmed,
      taskCategory: category,
      selectedMicroStep: '',
      feedbackSubmitted: false,
    });
    trackEvent(EXPERIMENT_EVENTS.TASK_SUBMITTED);
    navigate('/start');
  };

  return (
    <Layout showStep={1}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white border-2 border-navy rounded-3xl p-6 sm:p-8 shadow-[0_6px_0_#2D3436]"
      >
        <div className="mb-6">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-coral-500 bg-coral-50 border border-coral-200 rounded-full px-3 py-1 mb-3">
            Stage 1 · Pick your quest
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
            What do you need to work on?
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-navy-light">
            Write down the task you&apos;ve been putting off. Keep it simple.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <TaskInput
            value={taskText}
            onChange={(val) => {
              setTaskText(val);
              if (taskError) setTaskError('');
            }}
            error={taskError}
          />

          <CategorySelector
            selected={category}
            onSelect={(catId) => {
              setCategory(catId);
              if (categoryError) setCategoryError('');
            }}
            error={categoryError}
          />

          <div className="pt-2 flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/')}
            >
              Back
            </Button>
            <Button type="submit" variant="primary" size="lg">
              Continue
            </Button>
          </div>
        </form>
      </motion.div>
    </Layout>
  );
}
