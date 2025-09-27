import React from 'react';

// GaugeMeter renders a simple horizontal gauge from 0..1 with green/amber/red zones.
export const GaugeMeter = ({ value = 0 }) => {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const color = pct < 30 ? '#22c55e' : pct < 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ width: '100%', marginBottom: '0.5rem' }}>
      <div style={{
        width: '100%', height: '16px', borderRadius: '9999px', background: '#4b5563', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 200ms ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
        <span>0</span>
        <span>1.0</span>
      </div>
    </div>
  );
};

export default GaugeMeter;
