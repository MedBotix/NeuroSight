import React from 'react';
import styles from './CameraFeed.module.css';
import { useStimulus } from '../context/StimulusContext';

// Simple face alignment guides shown during calibration
export const FaceGuides = () => {
  const { phase } = useStimulus();
  if (phase !== 'calibrate' && phase !== 'idle') return null;
  return (
    <div className={styles.faceGuides} aria-label="Face alignment guides">
      <div className={styles.cornerTL} />
      <div className={styles.cornerTR} />
      <div className={styles.cornerBL} />
      <div className={styles.cornerBR} />
    </div>
  );
};

export default FaceGuides;
