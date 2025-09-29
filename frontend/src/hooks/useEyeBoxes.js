import { useEffect, useRef, useState } from 'react';

// Returns normalized square boxes for left/right eyes [{x,y,size},{x,y,size}] in [0..1]
// Uses FaceDetector API if available, else a simple heuristic fallback.
export const useEyeBoxes = (videoEl) => {
  const [eyes, setEyes] = useState(null); // [{x,y,size},{x,y,size}] normalized to overlay
  const timerRef = useRef(null);

  useEffect(() => {
    if (!videoEl) return;

    const FaceDetectorCtor = window.FaceDetector;

    const detect = async () => {
      try {
        if (!videoEl || videoEl.readyState !== 4) return;
        const vw = videoEl.videoWidth || 640;
        const vh = videoEl.videoHeight || 480;

        if (FaceDetectorCtor) {
          const detector = new FaceDetectorCtor({ fastMode: true, maxDetectedFaces: 1 });
          const faces = await detector.detect(videoEl);
          if (faces && faces[0]) {
            const face = faces[0].boundingBox; // {x,y,width,height} in px of the video frame
            // Approximate eye regions as upper-left and upper-right quadrants within the face box
            const size = Math.min(face.width, face.height) * 0.25;
            const leftX = face.x + face.width * 0.3 - size / 2;
            const rightX = face.x + face.width * 0.7 - size / 2;
            const eyeY = face.y + face.height * 0.38 - size / 2;

            const toNorm = (x, y, s) => ({ x: (x + s / 2) / vw, y: (y + s / 2) / vh, size: s / Math.max(vw, vh) });
            setEyes([
              toNorm(leftX, eyeY, size),
              toNorm(rightX, eyeY, size),
            ]);
          } else {
            // fallback heuristic
            setEyes([
              { x: 0.35, y: 0.4, size: 0.08 },
              { x: 0.65, y: 0.4, size: 0.08 },
            ]);
          }
        } else {
          // No FaceDetector support: fallback
          setEyes([
            { x: 0.35, y: 0.4, size: 0.08 },
            { x: 0.65, y: 0.4, size: 0.08 },
          ]);
        }
      } catch {
        // Silent fallback to keep UX smooth
        setEyes([
          { x: 0.35, y: 0.4, size: 0.08 },
          { x: 0.65, y: 0.4, size: 0.08 },
        ]);
      }
    };

    // Poll modestly to avoid perf issues
    timerRef.current = setInterval(detect, 300);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [videoEl]);

  return eyes;
};

export default useEyeBoxes;
