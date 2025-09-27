import React from 'react';

export const MetricsPanel = ({ metrics, summary }) => {
  return (
    <div style={{
      background: 'rgba(139, 148, 158, 0.08)',
      border: '1px solid rgba(139, 148, 158, 0.15)',
      borderRadius: '12px',
      padding: '1rem',
      marginTop: '0.75rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Metric label="Latency" value={metrics?.latencyMs ? `${Math.round(metrics.latencyMs)} ms` : '—'} />
        <Metric label="Tremor" value={metrics?.tremorHz ? `${metrics.tremorHz.toFixed(1)} Hz` : '—'} />
        <Metric label="Smoothness" value={metrics?.smoothness ? metrics.smoothness.toFixed(2) : '—'} />
      </div>
      <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#9ca3af' }}>
        Summary: {summary}
      </div>
    </div>
  );
};

const Metric = ({ label, value }) => (
  <div style={{ flex: '1 1 30%', minWidth: '150px' }}>
    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>{label}</div>
    <div style={{ fontFamily: 'monospace', fontWeight: 600 }}>{value}</div>
  </div>
);

export default MetricsPanel;
