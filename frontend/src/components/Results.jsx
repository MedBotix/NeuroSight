import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Results.module.css';

export const Results = ({ riskScore, anomalies, onFinish }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(riskScore * 100 * easeOut));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(animate);
  }, [riskScore]);

  const getScoreColor = (score) => {
    if (score < 30) return '#39D39F'; // Green
    if (score < 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getScoreLabel = (score) => {
    if (score < 30) return 'Low Risk';
    if (score < 60) return 'Moderate Risk';
    return 'High Risk';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={styles.container}
    >
      <div className={styles.card}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={styles.header}
        >
          <div className={styles.icon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#39D39F" strokeWidth="1.5">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
            </svg>
          </div>
          <h1 className={styles.title}>Analysis Complete</h1>
          <p className={styles.subtitle}>Preliminary cognitive health screening results</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={styles.scoreSection}
        >
          <div className={styles.scoreContainer}>
            <div className={styles.scoreLabel}>Atypical Pattern Score</div>
            <motion.div
              className={styles.scoreValue}
              style={{ color: getScoreColor(displayScore) }}
              animate={{ 
                textShadow: isAnimating ? `0 0 20px ${getScoreColor(displayScore)}40` : 'none'
              }}
            >
              {displayScore}%
            </motion.div>
            <div className={styles.scoreCategory} style={{ color: getScoreColor(displayScore) }}>
              {getScoreLabel(displayScore)}
            </div>
          </div>

          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <motion.div
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${displayScore}%` }}
                transition={{ duration: 2, ease: "easeOut" }}
                style={{ 
                  background: `linear-gradient(90deg, ${getScoreColor(displayScore)} 0%, ${getScoreColor(displayScore)}80 100%)`,
                  boxShadow: `0 0 10px ${getScoreColor(displayScore)}40`
                }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={styles.observations}
        >
          <h3 className={styles.observationsTitle}>Observations</h3>
          <div className={styles.observationsList}>
            {anomalies.length > 0 ? (
              anomalies.map((anomaly, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  className={styles.observation}
                >
                  <div className={styles.observationIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                  <span>{anomaly}</span>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className={styles.observation}
              >
                <div className={styles.observationIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#39D39F" strokeWidth="2">
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <span>No notable irregularities observed</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className={styles.disclaimer}
        >
          <div className={styles.disclaimerIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B949E" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <p>
            This screening tool provides preliminary cognitive assessment and is not a substitute for professional medical diagnosis. 
            Consult healthcare providers for comprehensive neurological evaluation.
          </p>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onFinish}
          className={styles.finishButton}
        >
          Finish & Close
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Results;
