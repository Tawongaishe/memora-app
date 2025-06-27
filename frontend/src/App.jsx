// src/App.jsx
import ModularObituaryPage from "./pages/ModularObitPage";
import SimpleAcknowledgmentsPage from "./pages/SimpleAcknowledgementsPage";
import React from "react";


function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ModularObituaryPage />
      {/* Uncomment the line below to use the SimpleAcknowledgmentsPage instead */}
      <SimpleAcknowledgmentsPage />
    </div>
  );
}

export default App;