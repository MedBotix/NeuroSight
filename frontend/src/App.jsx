import React from 'react';
import { CameraFeed } from './components/CameraFeed';
import ScreeningWizard from './components/ScreeningWizard';
import { StimulusProvider } from './context/StimulusContext';
import './index.css';

function App() {
  return (
    <StimulusProvider>
      <div className="app">
        <ScreeningWizard />
      </div>
    </StimulusProvider>
  );
}

export default App;