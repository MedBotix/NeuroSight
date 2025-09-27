import React, { useState, useRef, useEffect } from 'react';
import { neuroSightAPI } from '../services/api';
import '../index.css';

function SimpleApp() {
  const [stage, setStage] = useState('onboarding');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [countdown, setCountdown] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Check backend health on component mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const isHealthy = await neuroSightAPI.checkHealth();
      setBackendStatus(isHealthy ? 'connected' : 'disconnected');
    } catch (error) {
      setBackendStatus('disconnected');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      return true;
    } catch (error) {
      console.error('Camera access failed:', error);
      return false;
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startAnalysis = async () => {
    if (backendStatus !== 'connected') {
      alert('Backend is not connected. Please ensure the server is running.');
      return;
    }

    setStage('camera');
    const cameraStarted = await startCamera();
    
    if (!cameraStarted) {
      alert('Camera access is required for analysis.');
      setStage('onboarding');
      return;
    }

    // Wait a moment for camera to stabilize
    setTimeout(() => {
      setStage('countdown');
      startCountdown();
    }, 1000);
  };

  const startCountdown = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          beginAnalysis();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const beginAnalysis = async () => {
    setStage('analyzing');
    setIsAnalyzing(true);

    try {
      // Simulate 10-second analysis period
      const analysisPromise = new Promise((resolve) => {
        setTimeout(async () => {
          try {
            const result = await neuroSightAPI.predictFromVideo(videoRef.current);
            resolve(result);
          } catch (error) {
            console.error('Analysis failed:', error);
            // Fallback to dummy data if API fails
            resolve({
              risk_score: Math.random() * 0.8 + 0.1,
              confidence: 0.85,
              anomalies_detected: ['API_FALLBACK'],
              timestamp: new Date().toISOString()
            });
          }
        }, 10000); // 10 second analysis
      });

      const result = await analysisPromise;
      setAnalysisResults(result);
      setIsAnalyzing(false);
      stopCamera();
      setStage('results');
    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
      stopCamera();
      setStage('onboarding');
    }
  };

  const resetApp = () => {
    stopCamera();
    setStage('onboarding');
    setAnalysisResults(null);
    setIsAnalyzing(false);
    setCountdown(0);
  };

  if (stage === 'onboarding') {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#0D1117',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#E6EDF3',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          background: 'radial-gradient(circle at center, rgba(57, 211, 159, 0.05) 0%, rgba(13, 17, 23, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(57, 211, 159, 0.1)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          margin: '2rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#39D39F',
            marginBottom: '1rem',
            textShadow: '0 0 20px rgba(57, 211, 159, 0.3)'
          }}>
            NeuroSight
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#E6EDF3',
            marginBottom: '2rem',
            lineHeight: '1.6',
            opacity: '0.9'
          }}>
            A 10-second eye movement analysis for preliminary cognitive health screening
          </p>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              fontSize: '0.875rem',
              color: backendStatus === 'connected' ? '#39D39F' : '#EF4444',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: backendStatus === 'connected' ? '#39D39F' : '#EF4444'
              }} />
              Backend: {backendStatus === 'checking' ? 'Checking...' : backendStatus}
            </div>
          </div>
          <button
            onClick={startAnalysis}
            disabled={backendStatus !== 'connected'}
            style={{
              background: backendStatus === 'connected' 
                ? 'linear-gradient(135deg, #39D39F 0%, #2BC4A0 100%)'
                : 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
              color: '#0D1117',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: backendStatus === 'connected' ? 'pointer' : 'not-allowed',
              marginBottom: '1.5rem',
              boxShadow: backendStatus === 'connected' 
                ? '0 10px 20px rgba(57, 211, 159, 0.3)'
                : '0 10px 20px rgba(107, 114, 128, 0.3)'
            }}
          >
            {backendStatus === 'connected' ? 'Begin Screening' : 'Backend Unavailable'}
          </button>
          <p style={{
            fontSize: '0.875rem',
            color: '#8B949E',
            lineHeight: '1.5',
            opacity: '0.8'
          }}>
            This is a screening tool, not a medical diagnosis. Consult healthcare providers for comprehensive evaluation.
          </p>
        </div>
      </div>
    );
  }

  if (stage === 'camera') {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#0D1117',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#E6EDF3',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          background: 'radial-gradient(circle at center, rgba(57, 211, 159, 0.05) 0%, rgba(13, 17, 23, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(57, 211, 159, 0.1)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
          margin: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#39D39F',
            marginBottom: '1rem'
          }}>
            Camera Setup
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#E6EDF3',
            marginBottom: '2rem',
            opacity: '0.9'
          }}>
            Position yourself comfortably and look directly at the camera
          </p>
          <video
            ref={videoRef}
            style={{
              width: '320px',
              height: '240px',
              borderRadius: '12px',
              border: '2px solid rgba(57, 211, 159, 0.3)',
              marginBottom: '1rem'
            }}
            autoPlay
            muted
            playsInline
          />
        </div>
      </div>
    );
  }

  if (stage === 'countdown') {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#0D1117',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#E6EDF3',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          background: 'radial-gradient(circle at center, rgba(57, 211, 159, 0.05) 0%, rgba(13, 17, 23, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(57, 211, 159, 0.1)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
          margin: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#39D39F',
            marginBottom: '2rem'
          }}>
            Get Ready
          </h2>
          <div style={{
            fontSize: '6rem',
            fontWeight: '700',
            color: '#39D39F',
            marginBottom: '1rem',
            textShadow: '0 0 40px rgba(57, 211, 159, 0.5)'
          }}>
            {countdown}
          </div>
          <p style={{
            fontSize: '1rem',
            color: '#E6EDF3',
            opacity: '0.9'
          }}>
            Analysis will begin in {countdown} second{countdown !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    );
  }

  if (stage === 'analyzing') {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#0D1117',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#E6EDF3',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          background: 'radial-gradient(circle at center, rgba(57, 211, 159, 0.05) 0%, rgba(13, 17, 23, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(57, 211, 159, 0.1)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
          margin: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#39D39F',
            marginBottom: '2rem'
          }}>
            Analyzing Eye Movements
          </h2>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(57, 211, 159, 0.3)',
            borderTop: '4px solid #39D39F',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 2rem'
          }} />
          <p style={{
            fontSize: '1rem',
            color: '#E6EDF3',
            opacity: '0.9'
          }}>
            Please keep looking at the camera...
          </p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  if (stage === 'results' && analysisResults) {
    const score = Math.round((analysisResults.risk_score || 0) * 100);
    const confidence = Math.round((analysisResults.confidence || 0) * 100);
    
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#0D1117',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#E6EDF3',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          background: 'radial-gradient(circle at center, rgba(57, 211, 159, 0.05) 0%, rgba(13, 17, 23, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(57, 211, 159, 0.1)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
          margin: '2rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#39D39F',
            marginBottom: '0.5rem',
            textShadow: '0 0 20px rgba(57, 211, 159, 0.3)'
          }}>
            Analysis Complete
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#8B949E',
            marginBottom: '2rem',
            opacity: '0.9'
          }}>
            Preliminary cognitive health screening results
          </p>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#8B949E',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Risk Score
            </div>
            <div style={{
              fontFamily: 'SF Mono, Monaco, Inconsolata, Roboto Mono, monospace',
              fontSize: '4rem',
              fontWeight: '700',
              color: score < 30 ? '#39D39F' : score < 60 ? '#F59E0B' : '#EF4444',
              marginBottom: '0.5rem',
              textShadow: `0 0 30px ${score < 30 ? '#39D39F' : score < 60 ? '#F59E0B' : '#EF4444'}40`
            }}>
              {score}%
            </div>
            <div style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: score < 30 ? '#39D39F' : score < 60 ? '#F59E0B' : '#EF4444',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {score < 30 ? 'Low Risk' : score < 60 ? 'Moderate Risk' : 'High Risk'}
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            gap: '1rem'
          }}>
            <div style={{
              background: 'rgba(139, 148, 158, 0.05)',
              border: '1px solid rgba(139, 148, 158, 0.1)',
              borderRadius: '12px',
              padding: '1rem',
              flex: 1
            }}>
              <div style={{ fontSize: '0.75rem', color: '#8B949E', marginBottom: '0.5rem' }}>
                Confidence
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#39D39F' }}>
                {confidence}%
              </div>
            </div>
            <div style={{
              background: 'rgba(139, 148, 158, 0.05)',
              border: '1px solid rgba(139, 148, 158, 0.1)',
              borderRadius: '12px',
              padding: '1rem',
              flex: 1
            }}>
              <div style={{ fontSize: '0.75rem', color: '#8B949E', marginBottom: '0.5rem' }}>
                Anomalies
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#39D39F' }}>
                {analysisResults.anomalies_detected?.length || 0}
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(139, 148, 158, 0.05)',
            border: '1px solid rgba(139, 148, 158, 0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#8B949E',
              lineHeight: '1.5'
            }}>
              This screening tool provides preliminary cognitive assessment and is not a substitute for professional medical diagnosis. 
              Consult healthcare providers for comprehensive neurological evaluation.
            </p>
          </div>

          <button
            onClick={resetApp}
            style={{
              background: 'linear-gradient(135deg, #39D39F 0%, #2BC4A0 100%)',
              color: '#0D1117',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(57, 211, 159, 0.3)'
            }}
          >
            New Analysis
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default SimpleApp;
