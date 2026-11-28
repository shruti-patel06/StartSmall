import { Link } from 'react-router-dom';
import { CoinIcon } from './QuestIcons';

export function Layout({ children, showStep, totalSteps = 5 }) {
  return (
    <div className="min-h-screen bg-quest-grid flex flex-col">
      {/* Minimal header */}
      <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-black text-xl tracking-tight text-navy hover:opacity-80 transition-opacity"
        >
          <CoinIcon className="w-7 h-7" />
          <span>StartSmall</span>
        </Link>

        {showStep && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-navy-light bg-white border-2 border-navy/15 rounded-full px-3 py-1">
            <span>Stage {showStep}</span>
            <span className="text-navy-muted">/</span>
            <span>{totalSteps}</span>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col justify-center w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
