import React from 'react';
import { motion } from 'framer-motion';
import styles from './Calibration.module.css';

export const Calibration = ({ videoRef, statusText, isStable, onReady }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={styles.container}
    >
      <div className={styles.card}>
        <div className={styles.videoContainer}>
          <video 
            ref={videoRef} 
            className={styles.video} 
            autoPlay 
            playsInline 
            muted 
          />
          <div className={styles.overlay}>
            <div className={styles.guide}>
              <div className={styles.guideCorner} style={{ top: '20%', left: '20%' }} />
              <div className={styles.guideCorner} style={{ top: '20%', right: '20%' }} />
              <div className={styles.guideCorner} style={{ bottom: '20%', left: '20%' }} />
              <div className={styles.guideCorner} style={{ bottom: '20%', right: '20%' }} />
              <div className={styles.centerDot} />
            </div>
            <div className={styles.statusBadge}>
              {statusText}
            </div>
            <div className={styles.privacyBadge}>
              On-device • No uploads
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={styles.title}
          >
            Position Your Face
          </motion.h2>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={styles.instructions}
          >
            <div className={styles.instruction}>
              <div className={styles.instructionIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#39D39F" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <span>Position your face within the guide markers</span>
            </div>
            <div className={styles.instruction}>
              <div className={styles.instructionIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#39D39F" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <span>Ensure good lighting on your face</span>
            </div>
            <div className={styles.instruction}>
              <div className={styles.instructionIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#39D39F" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                </svg>
              </div>
              <span>Look directly at the center dot</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className={styles.stability}
          >
            <div className={`${styles.stabilityIndicator} ${isStable ? styles.stable : ''}`}>
              <div className={styles.stabilityIcon}>
                {isStable ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#39D39F" strokeWidth="2">
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B949E" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                )}
              </div>
              <span>{isStable ? 'Face detected and stable' : 'Adjusting position...'}</span>
            </div>
          </motion.div>

          {isStable && (
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReady}
              className={styles.readyButton}
            >
              Ready to Begin
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Calibration;
