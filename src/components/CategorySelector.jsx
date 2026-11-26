import { motion } from 'framer-motion';
import { TASK_CATEGORIES } from '../constants/categories';
import { CategoryIcon } from './QuestIcons';

export function CategorySelector({ selected, onSelect, error }) {
  return (
    <div className="space-y-2.5">
      <span className="block text-sm font-bold text-navy">
        Pick a category
      </span>
      <div
        role="radiogroup"
        aria-label="Task category"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {TASK_CATEGORIES.map((cat) => {
          const isSelected = selected === cat.id;
          return (
            <motion.button
              key={cat.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(cat.id)}
              whileHover={{ y: -2 }}
              whileTap={{ y: 1 }}
              className={`flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-all ${
                isSelected
                  ? 'border-navy bg-gold-light shadow-[0_4px_0_#2D3436]'
                  : 'border-navy/25 bg-white hover:border-navy shadow-soft'
              }`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 ${
                  isSelected ? 'border-navy bg-white' : 'border-navy/15 bg-cream'
                }`}
              >
                <CategoryIcon name={cat.icon} className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-navy text-sm sm:text-base">
                  {cat.label}
                </div>
                <div className="text-xs text-navy-light truncate">
                  {cat.shortDesc}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="text-sm font-semibold text-coral-500">
          {error}
        </p>
      )}
    </div>
  );
}
