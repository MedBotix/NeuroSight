import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Screening.module.css';

export const Screening = ({ onComplete }) => {
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [currentPoint, setCurrentPoint] = useState(0);

  const points = [
    { x: 50, y: 50, label: 'Center' },
    { x: 20, y: 30, label: 'Top Left' },
    { x: 80, y: 30, label: 'Top Right' },
    { x: 20, y: 70, label: 'Bottom Left' },
    { x: 80, y: 70, label: 'Bottom Right' },
  ];

  useEffect(() => {
    const duration = 10000; // 10 seconds
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);

      // Calculate which point we should be at
      const pointIndex = Math.min(points.length - 1, Math.floor(p * points.length));
      setCurrentPoint(pointIndex);
      setPos(points[pointIndex]);

      if (p >= 1) {
        onComplete();
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.container}
    >
      <div className={styles.screen}>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className={styles.progressText}>
            {Math.round(progress * 100)}%
          </div>
        </div>

        <motion.div
          className={styles.stimulusDot}
          animate={{ 
            left: `${pos.x}%`, 
            top: `${pos.y}%`,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            left: { type: "spring", stiffness: 120, damping: 18 },
            top: { type: "spring", stiffness: 120, damping: 18 },
            scale: { duration: 0.3, repeat: Infinity, repeatDelay: 1 }
          }}
        />

        <div className={styles.instruction}>
          <motion.div
            key={currentPoint}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={styles.instructionText}
          >
            Follow the dot with your eyes
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Screening;
