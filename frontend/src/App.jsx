// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MemoraIntroPage from './pages/MemoraIntroPage';
import StartMemorialPage from './pages/StartMemorialPage';
import FuneralChecklistPage from './pages/FuneralChecklistPage';
import ModularObituaryPage from './pages/ModularObitPage';
import SimpleAcknowledgmentsPage from './pages/SimpleAcknowledgementsPage';
import PhotoSelectionPage from './pages/PhotoSelectionPage';
import SpeechesPage from './pages/SpeechesPage';
import BodyViewingPage from './pages/BodyViewingPage';
import RepassLocationPage from './pages/RepassLocationPage';
import BurialLocationPage from './pages/BurialLocationPage';
import AccessMemorialPage from './pages/AccessMemorialPage';
import MemorialProgramReviewPage from './pages/ReviewPage';

function App() {
  return (
    <Router>
      <div style={{ width: '100%', height: '100vh' }}>
        <Routes>
          {/* Default route - Memora introduction */}
          <Route path="/" element={<MemoraIntroPage />} />
          
          {/* Simple memorial creation - just creates ID and shows it */}
          <Route path="/start-memorial" element={<StartMemorialPage />} />

          {/* Access existing memorial */}
          <Route path="/access-memorial" element={<AccessMemorialPage />} />

          {/* Funeral checklist */}
          <Route path="/funeral-checklist" element={<FuneralChecklistPage />} />
          
          {/* Individual passage routes */}
          <Route path="/obituary" element={<ModularObituaryPage />} />
          <Route path="/body-viewing" element={<BodyViewingPage />} />
          <Route path="/speeches" element={<SpeechesPage />} />
          <Route path="/acknowledgements" element={<SimpleAcknowledgmentsPage />} />
          <Route path="/repass-location" element={<RepassLocationPage />} />
          <Route path="/photos" element={<PhotoSelectionPage />} />
          <Route path="/burial-location" element={<BurialLocationPage />} />
          <Route path="/review" element={<MemorialProgramReviewPage />} />
          
          {/* Catch-all route - redirect to home if no match */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;