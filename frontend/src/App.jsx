// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MemoraIntroPage from './pages/MemoraIntroPage';
import FuneralChecklistPage from './pages/FuneralChecklistPage';
import ModularObituaryPage from './pages/ModularObitPage';
import SimpleAcknowledgmentsPage from './pages/SimpleAcknowledgementsPage';
import PhotoSelectionPage from './pages/PhotoSelectionPage';
import SpeechesPage from './pages/SpeechesPage';
import BodyViewingPage from './pages/BodyViewingPage';
import RepassLocationPage from './pages/RepassLocationPage';
import BurialLocationPage from './pages/BurialLocationPage';

function App() {
  return (
    <Router>
      <div style={{ width: '100%', height: '100vh' }}>
        <Routes>
          {/* Default route - Memora introduction */}
          <Route path="/" element={<MemoraIntroPage />} />
          
          {/* Funeral checklist */}
          <Route path="/funeral-checklist" element={<FuneralChecklistPage />} />
          
          {/* Individual passage routes */}
          <Route path="/obituary" element={<ModularObituaryPage />} />
          <Route path="/acknowledgements" element={<SimpleAcknowledgmentsPage />} />
          <Route path="/photos" element={<PhotoSelectionPage />} />
          <Route path="/speeches" element={<SpeechesPage />} />
          <Route path="/body-viewing" element={<BodyViewingPage />} />
          <Route path="/repass-location" element={<RepassLocationPage />} />
          <Route path="/burial-location" element={<BurialLocationPage />} />
          
          {/* Catch-all route - redirect to obituary if no match */}
          <Route path="*" element={<Navigate to="/obituary" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;