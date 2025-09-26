import { preprocessFrame } from '../utils/preprocessing';
import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

export const useNeuroSight = () => {
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);
  const [status, setStatus] = useState('Initializing...');
  const [results, setResults] = useState({ riskScore: 0, anomalies: [] });

  useEffect(() => {
    setStatus('Loading Model...');
    tf.loadGraphModel('/model_web/model.json')
      .then(loadedModel => { setModel(loadedModel); setStatus('Ready'); })
      .catch(err => { console.error(err); setStatus('Error: Could not load model.'); });
  }, []);

  useEffect(() => {
    if (!model) return;
    const setupCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    };
    setupCamera().catch(err => { console.error(err); setStatus('Error: Camera permission denied.'); });
  }, [model]);

  useEffect(() => {
    if (!model) return;
  
    const intervalId = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        if (status !== 'Analyzing...') setStatus('Analyzing...');
  
        // 1. Preprocess the current video frame
        const tensor = preprocessFrame(videoRef.current);
  
        // 2. Run inference with the model to get a prediction
        const prediction = await model.predict(tensor).data();
  
        // 3. IMPORTANT: Clean up the tensor to prevent memory leaks
        tf.dispose(tensor); 
  
        // 4. Update the UI with the real prediction from the model
        const riskScore = prediction[0];
        const anomalies = riskScore > 0.65 ? ["Potential Saccadic Lag"] : [];
  
        setResults({ riskScore, anomalies });
      }
    }, 200); // Run prediction 5 times per second
  
    return () => clearInterval(intervalId);
  }, [model, status]);

  return { videoRef, status, results };
};