import { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FlagsmithProvider } from '@flagsmith/flagsmith/react';
import {
  flagsmith,
  getFlagsmithOptions,
  isFlagsmithConfigured,
} from './flagsmith/flagsmithClient';
import { getItem, STORAGE_KEYS } from './services/storageService';
import { SessionProvider } from './context/SessionContext';
import { LandingPage } from './pages/LandingPage';
import { TaskEntryPage } from './pages/TaskEntryPage';
import { StartExperiencePage } from './pages/StartExperiencePage';
import { FocusSessionPage } from './pages/FocusSessionPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { CompletionPage } from './pages/CompletionPage';

export default function App() {
  const flagsmithOptions = useMemo(() => {
    const existingId = getItem(STORAGE_KEYS.USER_ID);
    if (!isFlagsmithConfigured()) {
      return { environmentID: 'unconfigured', preventFetch: true };
    }
    return getFlagsmithOptions(existingId || undefined);
  }, []);

  return (
    <FlagsmithProvider flagsmith={flagsmith} options={flagsmithOptions}>
      <SessionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/task" element={<TaskEntryPage />} />
            <Route path="/start" element={<StartExperiencePage />} />
            <Route path="/focus" element={<FocusSessionPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/complete" element={<CompletionPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </FlagsmithProvider>
  );
}
