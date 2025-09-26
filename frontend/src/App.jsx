import React from 'react';
import { CameraFeed } from './components/CameraFeed';
import styles from './components/CameraFeed.module.css';
import './index.css';

function App() {
  return (
    <div className={styles.container}>
      <CameraFeed />
    </div>
  );
}
export default App;
