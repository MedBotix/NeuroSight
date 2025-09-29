import React from 'react';
import { useNeuroSight } from '../hooks/useNeuroSight';
import useGazeMetrics from '../hooks/useGazeMetrics';
import { useStimulus } from '../context/StimulusContext';
import PrivacyBadge from './PrivacyBadge';
import { StimulusOverlay } from './StimulusOverlay';
import { TestController } from './TestController';
import FaceGuides from './FaceGuides';
import GaugeMeter from './GaugeMeter';
import MetricsPanel from './MetricsPanel';
import TraceChart from './TraceChart';
import GazeOverlay from './GazeOverlay';
import EyeBoxesOverlay from './EyeBoxesOverlay';
import styles from './CameraFeed.module.css';

export const CameraFeed = () => {
  const { videoRef, statusText, results } = useNeuroSight();
  const { metrics, riskScore, summary, samples } = useGazeMetrics();
  const { phase } = useStimulus();

  const getBarColor = (score) => {
    const pct = score * 100;
    if (pct < 30) return '#22c55e'; // green
    if (pct < 60) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

const FinalResults = () => {
  const { finalRisk, finalSummary } = useGazeMetrics();
  if (finalRisk == null) return null;
  return (
    <div>
      <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Short-window Final Screening Signal</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 700 }}>{finalRisk.toFixed(2)}</div>
        <div style={{ color: '#9ca3af' }}>• {finalSummary}</div>
      </div>
    </div>
  );
};
  return (
    <div className={styles.card}>
      <div className={styles.videoContainer}>
        <video ref={videoRef} className={styles.video} autoPlay playsInline muted />
        <div className={styles.statusBadge}>{statusText}</div>
        <FaceGuides />
        <EyeBoxesOverlay videoRef={videoRef} />
        <StimulusOverlay />
        <GazeOverlay />
      </div>
      <div className={styles.resultsContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
          <h1 className={styles.title} style={{ margin: 0 }}>NeuroSight Screening</h1>
          <PrivacyBadge />
        </div>
        <p className={styles.subtitle}>On-device, private screening. No data leaves your browser. Position your face in the frame.</p>
        <div className={styles.resultsBox}>
          <TestController />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h2 style={{ margin: 0 }}>Screening Signal</h2>
            <div className={styles.kpiChip} title="Live screening signal">
              <span className={styles.kpiValue}>{riskScore.toFixed(2)}</span>
              <span className={styles.kpiSep}>•</span>
              <span className={styles.kpiLabel}>{summary}</span>
            </div>
          </div>
          <GaugeMeter value={riskScore} />
          {typeof results.confidence === 'number' && (
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>
              Confidence: {(results.confidence * 100).toFixed(0)}%
            </div>
          )}
          <h2>Observed Irregularities</h2>
          <ul className={styles.anomaliesList}>
            {results.anomalies.length > 0 ? (
              results.anomalies.map((anomaly, index) => <li key={index}>- {anomaly}</li>)
            ) : (
              <li>- Awaiting screening...</li>
            )}
          </ul>
          <MetricsPanel metrics={metrics} summary={summary} />
          <div style={{ marginTop: '0.75rem' }}>
            <TraceChart samples={samples} />
          </div>
          {phase === 'finished' && (
            <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(139,148,158,0.08)', border: '1px solid rgba(139,148,158,0.15)' }}>
              <FinalResults />
            </div>
          )}
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.75rem' }}>
            This is a preliminary screening signal and not a medical diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
};