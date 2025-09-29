import React, { useMemo } from 'react';
import { useNeuroSight } from '../hooks/useNeuroSight';
import { useStimulus } from '../context/StimulusContext';
import useGazeMetrics from '../hooks/useGazeMetrics';
import { TestController } from './TestController';
import { StimulusOverlay } from './StimulusOverlay';
import FaceGuides from './FaceGuides';
import EyeBoxesOverlay from './EyeBoxesOverlay';
import GaugeMeter from './GaugeMeter';
import styles from './CameraFeed.module.css';

// Minimal, attractive multi-step wizard using existing hooks and overlays.
// Steps: welcome -> align -> testing -> results
export const ScreeningWizard = () => {
  const { videoRef, statusText } = useNeuroSight();
  const { phase, progress, reset } = useStimulus();
  const { riskScore, summary, finalRisk, finalSummary } = useGazeMetrics();

  const step = useMemo(() => {
    if (phase === 'idle') return 'welcome';
    if (phase === 'calibrate') return 'align';
    if (phase === 'finished') return 'results';
    return 'testing';
  }, [phase]);

  return (
    <div style={containerBg}>
      <div style={grid2x2}>
        {/* Welcome card */}
        <GlassCard>
          {step === 'welcome' ? (
            <div>
              <h2 style={titleGlow}>Welcome to NeuroSight</h2>
              <p style={muted}>A quick, on-device screening. Your privacy is guaranteed.</p>
              <div style={{ marginTop: '1rem' }}>
                <TestController />
              </div>
            </div>
          ) : (
            <CardArrow text="1" />
          )}
        </GlassCard>

        {/* Align (video) card */}
        <GlassCard>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>Center your face</h3>
              <span style={badge}>{statusText}</span>
            </div>
            <div className={styles.videoContainer}>
              <video ref={videoRef} className={styles.video} autoPlay playsInline muted />
              <FaceGuides />
              <EyeBoxesOverlay videoRef={videoRef} />
              <StimulusOverlay />
            </div>
            {step === 'align' && (
              <p style={mutedSmall}>Please hold still. Keep your eyes on the dot when the test begins.</p>
            )}
          </div>
        </GlassCard>

        {/* Testing progress card */}
        <GlassCard>
          <div>
            <h3 style={{ marginTop: 0 }}>Screening progress</h3>
            <div style={progressTrack} aria-label="progress">
              <div style={{ ...progressBar, width: `${Math.round(progress * 100)}%` }} />
            </div>
            <p style={mutedSmall}>Keep your eyes on the dot</p>
          </div>
        </GlassCard>

        {/* Results card */}
        <GlassCard>
          <div>
            <h3 style={{ marginTop: 0 }}>NeuroSight Analysis</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>Your Results</div>
                <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 28, fontWeight: 800 }}>
                  {(finalRisk ?? riskScore).toFixed(3)}
                </div>
              </div>
              <div style={{ minWidth: 200 }}>
                <GaugeMeter value={finalRisk ?? riskScore} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', fontSize: 11 }}>
              <span>0.0 Normal</span>
              <span>0.3 Early</span>
              <span>0.6 High</span>
              <span>1.0</span>
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>Summary: {finalSummary ?? summary}</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 10 }}>Disclaimer: This is not a diagnostic tool.</div>
            {step === 'results' && (
              <div style={{ marginTop: 12 }}>
                <button onClick={reset} style={btnPrimary}>Finish & Close</button>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

const GlassCard = ({ children }) => (
  <div style={glassCard}>
    {children}
  </div>
);

const CardArrow = ({ text }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
    <span>Step {text}</span>
  </div>
);

const containerBg = {
  minHeight: '100vh',
  padding: '24px',
  background: 'radial-gradient(1200px 600px at 20% 10%, rgba(43,196,160,0.12), transparent), radial-gradient(1000px 500px at 80% 60%, rgba(59,130,246,0.10), transparent), #0B1220'
};

const grid2x2 = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: 'auto auto',
  gap: '16px',
  maxWidth: 1100,
  margin: '0 auto'
};

const glassCard = {
  background: 'rgba(17, 24, 39, 0.45)',
  border: '1px solid rgba(148,163,184,0.18)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  padding: 16,
  minHeight: 220
};

const titleGlow = { textShadow: '0 0 20px rgba(43,196,160,0.35)' };
const muted = { color: '#9ca3af' };
const mutedSmall = { color: '#9ca3af', fontSize: 12 };
const badge = { background: 'rgba(59,130,246,0.3)', color: '#E6EDF3', fontSize: 12, padding: '2px 8px', borderRadius: 9999 };

const progressTrack = {
  width: '100%', height: 8, borderRadius: 9999,
  background: 'rgba(148,163,184,0.20)', overflow: 'hidden'
};
const progressBar = { height: '100%', background: 'linear-gradient(90deg,#39D39F,#2BC4A0)' };
const btnPrimary = {
  border: 'none', padding: '8px 14px', borderRadius: 10,
  background: 'linear-gradient(135deg, #39D39F, #2BC4A0)', color: '#0D1117',
  fontWeight: 700, cursor: 'pointer'
};

export default ScreeningWizard;
