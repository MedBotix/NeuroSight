import { useCallback, useEffect, useRef, useState } from 'react';

// Manages the stimulus timeline: fixation, saccades, smooth pursuit
// Provides target position in normalized coords [0..1] relative to the video container
// and phase labels for UI.
export const useStimulusTest = () => {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle | calibrate | fixation | saccade | pursuit | finished
  const [target, setTarget] = useState({ x: 0.5, y: 0.5 }); // normalized
  const startTimeRef = useRef(0);
  const rafRef = useRef(null);

  // Sequence schedule (seconds)
  // Total ~20s: 3s fixation center, 8s saccades, 8s pursuit
  const schedule = [
    { name: 'fixation', duration: 3 },
    { name: 'saccade', duration: 8 },
    { name: 'pursuit', duration: 8 },
  ];

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setRunning(false);
    setPhase('finished');
  }, []);

  const start = useCallback(() => {
    setRunning(true);
    setPhase('calibrate');
    // Small delay to let user settle
    setTimeout(() => {
      startTimeRef.current = performance.now();
      setPhase('fixation');
    }, 1000);
  }, []);

  useEffect(() => {
    if (!running) return;

    const totalDurationMs = schedule.reduce((acc, s) => acc + s.duration * 1000, 0);

    const animate = (now) => {
      const t = now - startTimeRef.current; // ms from fixation start
      if (t >= totalDurationMs) {
        stop();
        return;
      }
      // Determine current segment
      let acc = 0;
      let current = schedule[0];
      for (const seg of schedule) {
        if (t < acc + seg.duration * 1000) { current = seg; break; }
        acc += seg.duration * 1000;
      }
      if (phase !== current.name) setPhase(current.name);
      const localT = t - acc; // ms within current segment

      // Generate target position by segment
      let x = 0.5, y = 0.5;
      if (current.name === 'fixation') {
        x = 0.5; y = 0.5;
      } else if (current.name === 'saccade') {
        // Jump between corners every 800ms
        const slot = Math.floor(localT / 800) % 4;
        const positions = [
          { x: 0.5, y: 0.5 },
          { x: 0.85, y: 0.2 },
          { x: 0.15, y: 0.8 },
          { x: 0.8, y: 0.8 },
        ];
        ({ x, y } = positions[slot]);
      } else if (current.name === 'pursuit') {
        // Smooth horizontal sinusoidal sweep across the screen
        const periodMs = 3000; // 3s back-and-forth
        const w = (localT % periodMs) / periodMs; // 0..1
        // Ping-pong motion 0..1..0
        const pingpong = w < 0.5 ? (w * 2) : (2 - w * 2);
        x = 0.1 + 0.8 * pingpong;
        y = 0.5;
      }

      setTarget({ x, y });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running, phase, stop]);

  return { running, phase, target, start, stop };
};

export default useStimulusTest;
