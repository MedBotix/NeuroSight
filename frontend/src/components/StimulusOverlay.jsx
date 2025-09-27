import React, { useMemo } from 'react';
import { useStimulus } from '../context/StimulusContext';
import styles from './CameraFeed.module.css';

// Renders a high-contrast dot overlay positioned using normalized coordinates
// returned by useStimulusTest().
export const StimulusOverlay = () => {
  const { running, phase, target } = useStimulus();

  // Accessibility label per phase
  const phaseLabel = useMemo(() => {
    switch (phase) {
      case 'calibrate': return 'Calibration';
      case 'fixation': return 'Fixation';
      case 'saccade': return 'Saccade';
      case 'pursuit': return 'Smooth pursuit';
      case 'finished': return 'Finished';
      default: return 'Idle';
    }
  }, [phase]);

  return (
    <div className={styles.overlayRoot} aria-label={`Stimulus overlay: ${phaseLabel}`}>
      {/* Stimulus dot */}
      {running && (phase === 'fixation' || phase === 'saccade' || phase === 'pursuit') && (
        <div
          className={styles.stimulusDot}
          style={{ left: `${target.x * 100}%`, top: `${target.y * 100}%` }}
        />
      )}
      {/* Phase tag (small) */}
      {running && (
        <div className={styles.phaseTag}>{phaseLabel}</div>
      )}
    </div>
  );
};

export default StimulusOverlay;
