import React, { useCallback } from 'react';
import { useStimulus } from '../context/StimulusContext';

export const TestController = () => {
  const { running, phase, start, stop } = useStimulus();

  const speak = useCallback((text) => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.0;
      utter.pitch = 1.0;
      synth.speak(utter);
    } catch {}
  }, []);

  const onBegin = () => {
    speak('The test will begin shortly. Please keep your head still and follow the dot with only your eyes.');
    start();
  };

  const onStop = () => {
    stop();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
      {!running ? (
        <button onClick={onBegin} style={btnStylePrimary}>Begin Test</button>
      ) : (
        <button onClick={onStop} style={btnStyleSecondary}>Stop</button>
      )}
      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
        Status: {phase === 'idle' ? 'Ready' : phase.charAt(0).toUpperCase() + phase.slice(1)}
      </span>
    </div>
  );
};

const btnBase = {
  border: 'none',
  padding: '0.5rem 0.9rem',
  borderRadius: '8px',
  fontWeight: 600,
  cursor: 'pointer'
};

const btnStylePrimary = { ...btnBase, background: 'linear-gradient(135deg, #39D39F 0%, #2BC4A0 100%)', color: '#0D1117' };
const btnStyleSecondary = { ...btnBase, background: '#4b5563', color: '#E6EDF3' };

export default TestController;
