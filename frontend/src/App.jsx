import React from 'react';
import { CameraFeed } from './components/CameraFeed';
import { StimulusProvider } from './context/StimulusContext';
import './index.css';

function App() {
  return (
    <StimulusProvider>
      <div className="app">
        <CameraFeed />
      </div>
    </StimulusProvider>
  );
}

export default App;