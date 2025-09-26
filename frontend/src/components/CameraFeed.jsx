import React from 'react';
import { useNeuroSight } from '../hooks/useNeuroSight';
import styles from './CameraFeed.module.css';

export const CameraFeed = () => {
  const { videoRef, status, results } = useNeuroSight();
  return (
    <div className={styles.card}>
      <div className={styles.videoContainer}>
        <video ref={videoRef} className={styles.video} autoPlay playsInline muted />
        <div className={styles.statusBadge}>{status}</div>
      </div>
      <div className={styles.resultsContainer}>
        <h1 className={styles.title}>NeuroSight Analysis</h1>
        <p className={styles.subtitle}>Position your face in the frame.</p>
        <div className={styles.resultsBox}>
          <h2>Risk Score</h2>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${results.riskScore * 100}%` }}></div>
          </div>
          <p className={styles.scoreText}>{results.riskScore.toFixed(2)}</p>
          <h2>Detected Anomalies</h2>
          <ul className={styles.anomaliesList}>
            {results.anomalies.length > 0 ? (
              results.anomalies.map((anomaly, index) => <li key={index}>- {anomaly}</li>)
            ) : (
              <li>- Awaiting analysis...</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};