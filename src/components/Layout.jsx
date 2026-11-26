import { Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { EXPERIMENT_VARIANTS } from '../constants/experimentEvents';
import { CoinIcon } from './QuestIcons';

export function Layout({ children, showStep, totalSteps = 5 }) {
  const { experimentVariant, switchVariantForPreview } = useSession();

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

        <div className="flex items-center gap-3">
          {showStep && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-navy-light bg-white border-2 border-navy/15 rounded-full px-3 py-1">
              <span>Stage {showStep}</span>
              <span className="text-navy-muted">/</span>
              <span>{totalSteps}</span>
            </div>
          )}

          {/* Phase 1 preview switcher to test Control vs Guided without Flagsmith */}
          <div
            className="flex items-center bg-white border-2 border-navy/20 rounded-full p-0.5 text-xs font-bold"
            title="Phase 1 Preview Mode (Replaced by Flagsmith in Phase 2)"
          >
            <button
              type="button"
              onClick={() => switchVariantForPreview(EXPERIMENT_VARIANTS.CONTROL)}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                experimentVariant === EXPERIMENT_VARIANTS.CONTROL
                  ? 'bg-navy text-white'
                  : 'text-navy-light hover:text-navy'
              }`}
            >
              Control
            </button>
            <button
              type="button"
              onClick={() => switchVariantForPreview(EXPERIMENT_VARIANTS.GUIDED)}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                experimentVariant === EXPERIMENT_VARIANTS.GUIDED
                  ? 'bg-coral-400 text-white'
                  : 'text-navy-light hover:text-navy'
              }`}
            >
              Guided
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
