import React from 'react';
import styles from './CameraFeed.module.css';
import useGazeMetrics from '../hooks/useGazeMetrics';
import { useStimulus } from '../context/StimulusContext';

// Renders a red dot at the current gaze position (normalized [0..1])
// for alignment/live feedback. Only shown when we have a gaze sample.
export const GazeOverlay = () => {
  const { gaze } = useGazeMetrics();
  const { running } = useStimulus();

  if (!gaze) return null;

  return (
    <div className={styles.overlayRoot} aria-label="Gaze overlay">
      <div
        className={styles.gazeDot}
        title={running ? 'Estimated gaze' : 'Estimated gaze (idle)'}
        style={{ left: `${gaze.x * 100}%`, top: `${gaze.y * 100}%` }}
      />
    </div>
  );
};

export default GazeOverlay;
