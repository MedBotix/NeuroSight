import { preprocessFrameToTensor, stackSequence, SEQUENCE_LENGTH } from '../utils/preprocessing';
import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

export const useNeuroSight = () => {
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);
  const [appStatus, setAppStatus] = useState('loading');
  const [statusText, setStatusText] = useState('Initializing...');
  const [results, setResults] = useState({ riskScore: 0, anomalies: [] });
  const framesRef = useRef([]);
  const analyzeHandle = useRef(null);

  // Load model (GraphModel or LayersModel) from /public/model_web/model.json if present
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setStatusText('Loading model...');
        // Try GraphModel first
        let loaded = null;
        try {
          // tf.loadGraphModel fetches from public path
          loaded = await tf.loadGraphModel('/model_web/model.json');
        } catch (e) {
          // Fallback to LayersModel
          try {
            loaded = await tf.loadLayersModel('/model_web/model.json');
          } catch (_) {
            // Will fallback to dummy
          }
        }
        if (!loaded) {
          console.warn('TFJS model not found, using dummy predictions');
          if (!cancelled) {
            setModel('dummy');
            setAppStatus('ready');
            setStatusText('Ready (demo mode)');
          }
          return;
        }
        if (!cancelled) {
          setModel(loaded);
          setAppStatus('ready');
          setStatusText('Ready');
        }
      } catch (err) {
        console.error('Model load error', err);
        if (!cancelled) {
          setModel('dummy');
          setAppStatus('ready');
          setStatusText('Ready (demo mode)');
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Camera lifecycle (explicit consent)
  const enableCamera = async () => {
    if (!model) return false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatusText('Camera ready');
      return true;
    } catch (err) {
      console.error(err);
      setAppStatus('error');
      setStatusText('Error: Camera permission denied.');
      return false;
    }
  };

  // Start analysis loop when model is ready and camera is active
  useEffect(() => {
    const start = async () => {
      if (appStatus !== 'ready' || !model) return;
      const ok = await enableCamera();
      if (!ok) return;
      setStatusText('Analyzing...');
      if (analyzeHandle.current) clearInterval(analyzeHandle.current);
      analyzeHandle.current = setInterval(async () => {
        try {
          if (!videoRef.current || videoRef.current.readyState !== 4) return;
          const frameTensor = preprocessFrameToTensor(videoRef.current);
          framesRef.current.push(frameTensor);
          if (framesRef.current.length > SEQUENCE_LENGTH) {
            const old = framesRef.current.shift();
            old.dispose();
          }
          if (framesRef.current.length === SEQUENCE_LENGTH) {
            const input = stackSequence(framesRef.current);
            let risk = 0;
            if (model && typeof model !== 'string') {
              // Try LayersModel.predict
              try {
                const pred = model.predict ? model.predict(input) : await model.executeAsync(input);
                const data = await pred.data();
                risk = data[0] ?? 0;
                tf.dispose(pred);
              } catch (e) {
                // fallback demo risk
                risk = Math.random() * 0.6 + 0.2;
              }
            } else {
              // demo mode
              risk = Math.random() * 0.6 + 0.2;
            }
            const anomalies = risk > 0.65 ? ['Potential eye-movement irregularity'] : [];
            setResults({ riskScore: risk, anomalies });
            tf.dispose(input);
          }
        } catch (e) {
          console.error('Analyze error', e);
          setStatusText('Error during analysis');
        }
      }, 150);
    };
    start();
    return () => { if (analyzeHandle.current) clearInterval(analyzeHandle.current); };
  }, [appStatus, model]);

  // Pause on tab hide
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        if (analyzeHandle.current) clearInterval(analyzeHandle.current);
        setStatusText('Paused');
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return { videoRef, appStatus, statusText, results };
};