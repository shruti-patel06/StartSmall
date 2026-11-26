import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import { LandingPage } from './pages/LandingPage';
import { TaskEntryPage } from './pages/TaskEntryPage';
import { StartExperiencePage } from './pages/StartExperiencePage';
import { FocusSessionPage } from './pages/FocusSessionPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { CompletionPage } from './pages/CompletionPage';

export default function App() {
  return (
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
  );
}
