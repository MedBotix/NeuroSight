import { useEffect, useMemo, useRef, useState } from 'react';
import { useStimulus } from '../context/StimulusContext';

// useGazeMetrics computes placeholder metrics from stimulus vs. a proxy gaze.
// For now, we simulate gaze as the target plus small noise to avoid
// runtime conflicts until a true TFJS gaze estimator is integrated.
// Metrics:
// - latencyMs: simulated reaction delay to saccade jumps
// - tremorHz: micro jitter during fixation
// - smoothness: inverse of error variance during pursuit (0..1)
export const useGazeMetrics = () => {
  const { running, phase, target } = useStimulus();
  const [latencyMs, setLatencyMs] = useState(0);
  const [tremorHz, setTremorHz] = useState(0);
  const [smoothness, setSmoothness] = useState(0.0);
  const [riskScore, setRiskScore] = useState(0.2);
  const [finalRisk, setFinalRisk] = useState(null);
  const [gaze, setGaze] = useState(null); // normalized {x,y}
  const [samplesVersion, setSamplesVersion] = useState(0); // trigger chart redraws

  // Internals
  const lastJumpRef = useRef(performance.now());
  const lastTargetRef = useRef({ x: target.x, y: target.y });
  const jitterPhaseRef = useRef(0);
  const pursuitErrAccRef = useRef(0);
  const pursuitCountRef = useRef(0);
  const recentRiskRef = useRef([]); // [{t, r}]
  const samplesRef = useRef([]); // bounded time-series for plotting

  useEffect(() => {
    if (!running) return;

    const tick = () => {
      // Simulated gaze as target plus tiny noise
      const noise = (amp = 0.01) => (Math.random() - 0.5) * 2 * amp;
      const gaze = { x: target.x + noise(), y: target.y + noise() };
      setGaze(gaze);

      // Detect saccade jumps by target displacement
      const dx = Math.abs(target.x - lastTargetRef.current.x);
      const dy = Math.abs(target.y - lastTargetRef.current.y);
      const moved = (dx + dy) > 0.2; // heuristic for jump
      const now = performance.now();

      if (phase === 'saccade') {
        if (moved) {
          lastJumpRef.current = now; // target jumped
        } else {
          // compute fake latency as a small positive value around 150-250ms
          const simLatency = 150 + Math.random() * 100;
          setLatencyMs(simLatency);
        }
      }

      if (phase === 'fixation') {
        // tremor as a small frequency 6-12 Hz typical micro saccades
        jitterPhaseRef.current += 0.05 + Math.random() * 0.02;
        const freq = 6 + (Math.sin(jitterPhaseRef.current) + 1) * 3; // 6..12 Hz
        setTremorHz(Number(freq.toFixed(1)));
      }

      if (phase === 'pursuit') {
        // accumulate squared error; lower error => higher smoothness
        const err = (gaze.x - target.x) ** 2 + (gaze.y - target.y) ** 2;
        pursuitErrAccRef.current += err;
        pursuitCountRef.current += 1;
        const avgErr = pursuitErrAccRef.current / Math.max(1, pursuitCountRef.current);
        const simSmooth = Math.max(0, Math.min(1, 1 - avgErr * 25)); // scale
        setSmoothness(Number(simSmooth.toFixed(2)));
      }

      // Aggregate risk score as a simple blend (placeholder)
      const latencyRisk = Math.min(1, Math.max(0, (latencyMs - 120) / 300));
      const tremorRisk = Math.min(1, tremorHz / 20);
      const smoothnessRisk = 1 - smoothness; // lower smoothness => higher risk
      const agg = 0.4 * latencyRisk + 0.3 * tremorRisk + 0.3 * smoothnessRisk;
      const r = Number(agg.toFixed(2));
      setRiskScore(r);
      // keep last ~3s of risk samples
      const nowTs = performance.now();
      recentRiskRef.current.push({ t: nowTs, r });
      const cutoff = nowTs - 3000;
      while (recentRiskRef.current.length && recentRiskRef.current[0].t < cutoff) recentRiskRef.current.shift();

      // push plotting sample and bound buffer (last ~10s)
      samplesRef.current.push({ t: nowTs, target: { ...target }, gaze, risk: r });
      const cutoffPlot = nowTs - 10000; // 10s window
      while (samplesRef.current.length && samplesRef.current[0].t < cutoffPlot) samplesRef.current.shift();
      if ((samplesRef.current.length % 5) === 0) setSamplesVersion(v => (v + 1));

      lastTargetRef.current = { ...target };
      if (running) requestAnimationFrame(tick);
    };

    pursuitErrAccRef.current = 0;
    pursuitCountRef.current = 0;
    requestAnimationFrame(tick);

    return () => {
      pursuitErrAccRef.current = 0;
      pursuitCountRef.current = 0;
    };
  }, [running, phase, target, latencyMs, tremorHz, smoothness]);

  // When test finishes, compute short-window average as finalRisk
  useEffect(() => {
    if (phase === 'finished') {
      const arr = recentRiskRef.current;
      if (arr.length) {
        const avg = arr.reduce((s, it) => s + it.r, 0) / arr.length;
        setFinalRisk(Number(avg.toFixed(2)));
      } else {
        setFinalRisk(riskScore);
      }
    }
  }, [phase, riskScore]);

  const metrics = useMemo(() => ({ latencyMs, tremorHz, smoothness }), [latencyMs, tremorHz, smoothness]);
  const samples = useMemo(() => samplesRef.current.slice(), [samplesVersion]);

  // Neutral labels for UI
  const summary = useMemo(() => {
    if (riskScore < 0.3) return 'Normal';
    if (riskScore < 0.6) return 'Early Risk';
    return 'High Risk';
  }, [riskScore]);

  const finalSummary = useMemo(() => {
    if (finalRisk == null) return null;
    if (finalRisk < 0.3) return 'Normal';
    if (finalRisk < 0.6) return 'Early Risk';
    return 'High Risk';
  }, [finalRisk]);

  return { metrics, riskScore, summary, finalRisk, finalSummary, samples, gaze };
};

export default useGazeMetrics;
