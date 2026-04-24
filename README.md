<div align="center">
  <br/>
  <br/>

  <h1 align="center" style="font-size: 3rem; font-weight: 800; letter-spacing: 2px;">
    N E U R O &nbsp;&nbsp;&nbsp; S I G H T
  </h1>
  
  <p align="center" style="font-size: 1.2rem; color: #555; text-transform: uppercase; letter-spacing: 1px;">
    <strong>Privacy-First Neurological Screening AI</strong>
  </p>

  <p align="center" style="font-size: 1.1rem; max-width: 600px; margin: 0 auto; color: #666;">
    On-device eye-movement screening powered by TensorFlow.js. A multi-step diagnostic interface that computes live screening signals entirely in the browser—zero server data retention.
  </p>

  <br />

  <p align="center">
    <a href="#features" style="text-decoration: none; color: inherit;"><b>FEATURES</b></a> &nbsp;&nbsp;&nbsp;︱&nbsp;&nbsp;&nbsp; 
    <a href="#getting-started" style="text-decoration: none; color: inherit;"><b>GETTING STARTED</b></a> &nbsp;&nbsp;&nbsp;︱&nbsp;&nbsp;&nbsp; 
    <a href="#architecture" style="text-decoration: none; color: inherit;"><b>ARCHITECTURE</b></a>
  </p>

  <br/>
  <br/>
</div>

### ✦ SYSTEM OVERVIEW ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<table width="100%" style="border-collapse: separate; border-spacing: 15px; border: none;">
  <tr style="border: none;">
    <td width="50%" valign="top" style="border: 1px solid #eaeaea; padding: 24px; border-radius: 12px; background-color: #fafbfc;">
      <h3 style="margin-top: 0; font-size: 1.4em;">🔒 Privacy-First AI</h3>
      <p style="color: #586069; margin-top: -10px;"><i>Zero Data Retention</i></p>
      <p>All processing happens locally on the user's device using TensorFlow.js. Video frames and tracking data never leave the browser, ensuring complete patient confidentiality.</p>
      <p><code>TensorFlow.js</code> <code>Local Inference</code></p>
    </td>
    <td width="50%" valign="top" style="border: 1px solid #eaeaea; padding: 24px; border-radius: 12px; background-color: #fafbfc;">
      <h3 style="margin-top: 0; font-size: 1.4em;">👁️ Advanced Stimulus</h3>
      <p style="color: #586069; margin-top: -10px;"><i>Neurological Tracking</i></p>
      <p>Engineered a continuous stimulus controller tracking Fixation, Saccades, and Smooth Pursuit movements over a 30-second diagnostic window.</p>
      <p><code>Computer Vision</code> <code>Canvas API</code></p>
    </td>
  </tr>
  <tr style="border: none;">
    <td width="50%" valign="top" style="border: 1px solid #eaeaea; padding: 24px; border-radius: 12px; background-color: #fafbfc;">
      <h3 style="margin-top: 0; font-size: 1.4em;">📊 Live Diagnostics</h3>
      <p style="color: #586069; margin-top: -10px;"><i>Real-Time Trace Charts</i></p>
      <p>Provides live overlays, facial bounding boxes, and an interactive trace chart plotting target versus gaze timelines and associated risk factors.</p>
      <p><code>Live Metrics</code> <code>Data Visualization</code></p>
    </td>
    <td width="50%" valign="top" style="border: 1px solid #eaeaea; padding: 24px; border-radius: 12px; background-color: #fafbfc;">
      <h3 style="margin-top: 0; font-size: 1.4em;">📱 Modern Interface</h3>
      <p style="color: #586069; margin-top: -10px;"><i>Clinical UX Design</i></p>
      <p>A multi-step wizard UI featuring glassmorphism cards and a neutral, clinical design language that prioritizes user comfort and clarity.</p>
      <p><code>React</code> <code>Vite</code> <code>Tailwind</code></p>
    </td>
  </tr>
</table>

<br/>

### ✦ GETTING STARTED (ON-DEVICE SCREENING) ━━━━━━━━━━━━━━━━━━━━━━━

**1. Clone the Repository**
```bash
git clone https://github.com/MedBotix/NeuroSight.git
cd NeuroSight/frontend
```

**2. Install Dependencies & Run**
```bash
npm install
npm run dev
```

**3. Model Placement**
Ensure your compiled TensorFlow.js model is located at `frontend/public/model_web/model.json`. Default preprocessing expects `[64,64,3]` frames, stacked to `[1, 16, 64, 64, 3]`.

<br/>

### ✦ PROJECT ARCHITECTURE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```text
NeuroSight/
├── frontend/                      # React + Vite Web Application
│   ├── public/model_web/          # On-Device TF.js Models
│   └── src/
│       ├── components/            # UI Components & Overlays
│       ├── hooks/                 # React Hooks for Camera & TF.js
│       └── utils/                 # ML Preprocessing & Signal Logic
├── backend/                       # Legacy FastAPI (Not required for UI)
└── ml/                            # Python Training Utilities & Notebooks
```

<br/>

### ✦ DISCLAIMER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- **Not a Medical Diagnosis:** This software computes a preliminary screening signal. It is an educational and research prototype and should never replace professional medical consultation.
- **Data Privacy:** "Screen, don’t diagnose." All computations remain strictly within the client browser environment.

<br/>
<br/>

<div align="center">
  <p style="color: #888;"><i>© 2026 NeuroSight Project Team &middot; Engineering & Documentation</i></p>
</div>
