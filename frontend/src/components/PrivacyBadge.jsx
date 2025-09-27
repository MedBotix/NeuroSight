import React from 'react';

export const PrivacyBadge = () => {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      background: 'rgba(34, 197, 94, 0.12)',
      color: '#86efac',
      border: '1px solid rgba(34, 197, 94, 0.35)',
      padding: '0.25rem 0.6rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#86efac" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
      <span>On-device • No uploads</span>
    </div>
  );
};

export default PrivacyBadge;
