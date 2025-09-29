import React, { useEffect, useRef, useState } from 'react';
import styles from './CameraFeed.module.css';
import { useEyeBoxes } from '../hooks/useEyeBoxes';

// Draw square boxes around estimated eye positions using a responsive overlay.
export const EyeBoxesOverlay = ({ videoRef }) => {
  const overlayRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const eyes = useEyeBoxes(videoRef?.current);

  useEffect(() => {
    const update = () => {
      const el = overlayRef.current;
      if (!el) return;
      setSize({ w: el.clientWidth || 0, h: el.clientHeight || 0 });
    };
    update();
    window.addEventListener('resize', update);
    const id = setInterval(update, 500);
    return () => { window.removeEventListener('resize', update); clearInterval(id); };
  }, []);

  return (
    <div ref={overlayRef} className={styles.overlayRoot} aria-label="Eye boxes overlay">
      {Array.isArray(eyes) && eyes.map((e, idx) => {
        const maxDim = Math.max(size.w, size.h) || 1;
        const boxSize = e.size * maxDim;
        const left = e.x * size.w;
        const top = e.y * size.h;
        const style = {
          left: `${left}px`,
          top: `${top}px`,
          width: `${boxSize}px`,
          height: `${boxSize}px`,
          marginLeft: `${-boxSize / 2}px`,
          marginTop: `${-boxSize / 2}px`,
        };
        return <div key={idx} className={styles.eyeBox} style={style} />;
      })}
    </div>
  );
};

export default EyeBoxesOverlay;
