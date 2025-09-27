import React, { useEffect, useRef } from 'react';

// TraceChart renders time-series of target vs. gaze (normalized 0..1)
// and a compact risk timeline under it. It is lightweight and conflict-free
// (no external chart libs).
export const TraceChart = ({ samples = [], height = 140, riskHeight = 36 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const widthCss = canvas.clientWidth || 400;
    const heightCss = height + riskHeight + 12; // padding between charts
    canvas.width = Math.floor(widthCss * dpr);
    canvas.height = Math.floor(heightCss * dpr);

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, widthCss, heightCss);

    if (!samples.length) return;

    const tmin = samples[0].t;
    const tmax = samples[samples.length - 1].t;
    const span = Math.max(1, tmax - tmin);

    // Upper plot: target.x and gaze.x in [0..1]
    const plotPadding = 8;
    const w = widthCss - plotPadding * 2;
    const h = height - plotPadding * 2;
    const ox = plotPadding;
    const oy = plotPadding;

    // Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.strokeRect(ox, oy, w, h);

    const xFromT = (t) => ox + ((t - tmin) / span) * w;
    const yFromVal = (v) => oy + (1 - Math.max(0, Math.min(1, v))) * h;

    // Target (teal)
    ctx.beginPath();
    samples.forEach((s, i) => {
      const x = xFromT(s.t);
      const y = yFromVal(s.target.x);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#2BC4A0';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Gaze (yellow)
    ctx.beginPath();
    samples.forEach((s, i) => {
      const x = xFromT(s.t);
      const y = yFromVal(s.gaze.x);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Legend
    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText('x-position (target vs gaze)', ox, oy - 2);

    // Lower plot: risk timeline 0..1
    const ry = height + 8;
    const rh = riskHeight - 12;
    ctx.strokeStyle = '#374151';
    ctx.strokeRect(ox, ry, w, rh);

    const colorFromRisk = (r) => (r < 0.3 ? '#22c55e' : r < 0.6 ? '#f59e0b' : '#ef4444');

    ctx.beginPath();
    samples.forEach((s, i) => {
      const x = xFromT(s.t);
      const y = ry + (1 - Math.max(0, Math.min(1, s.risk))) * rh;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    // Stroke in gradient-ish by re-stroking segments for color changes
    // For simplicity, draw a single color based on last risk
    ctx.strokeStyle = colorFromRisk(samples[samples.length - 1].risk);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#9ca3af';
    ctx.fillText('risk timeline', ox, ry - 2);
  }, [samples, height, riskHeight]);

  return (
    <div style={{ width: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: height + riskHeight + 12 }} />
    </div>
  );
};

export default TraceChart;
