# NeuroSight – On‑Device Eye‑Movement Screening

Privacy‑first, on‑device eye‑movement screening in the browser using TensorFlow.js. Users follow a moving dot; the app computes a live screening signal and a short‑window final indicator at the end. No video frames leave the device.

## At a Glance (Minimal)

- **Run**
  - `cd frontend && npm install && npm run dev`
  - Open the shown URL (e.g., http://localhost:5173) and allow camera.
- **Model**
  - Place your TF.js model at `frontend/public/model_web/model.json` (+ shards).
  - Preprocessing defaults: `[64,64,3]` frames → `[1,16,64,64,3]` stacked.
- **Use**
  - Click “Begin Screening” → Align → Follow the dot → View results.
- **Privacy**
  - All processing is on-device; nothing is uploaded. This is not a diagnosis.

## Project Structure

```
NeuroSight/
├── backend/                      # Optional/legacy FastAPI (not required for on‑device screening)
│   └── api.py
├── frontend/                      # React + Vite web application
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   ├── vite.svg
│   │   └── model_web/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── App.css
│       ├── assets/
│       ├── components/
│       ├── hooks/
│       └── utils/
├── ml/                           # Optional/legacy Python training utilities
│   ├── model.py
│   ├── predict.py
│   └── train.py
├── data_processing/
│   └── preprocess.py
├── data/
├── src/                           # Root-level assets (currently CSS and empty dirs)
│   ├── components/
│   ├── hooks/
│   └── index.css
├── requirements.txt
├── .gitignore
└── README.md
```

## Features

- **On‑device TF.js**: Runs entirely in the browser; no uploads
- **Stimulus controller**: Fixation → Saccades → Smooth Pursuit (20–30s)
- **Multi‑step wizard UI**: Welcome → Align → Testing → Results (glassmorphism cards)
- **Live overlays**: Face guides, eye boxes, stimulus dot, optional red gaze dot
- **Metrics & signal**: Live screening signal + short‑window final indicator
- **Trace chart**: Target vs. gaze timeline + risk timeline (lightweight canvas)
- **Privacy‑first**: Clear, neutral copy; “Screen, don’t diagnose” disclaimer

## Prerequisites

- Node.js 18+ and npm
- (Optional) Python 3.10+ if using legacy backend/training scripts

## Quick Start (On‑Device Only)

### 1) Clone and set up

```bash
# Clone the repository
git clone https://github.com/MedBotix/NeuroSight
cd NeuroSight

# (Optional) If you plan to use Python backend/training, see Legacy section below
```

### 2) Run the frontend (React + Vite)

```bash
# From repo root
cd frontend
npm install
npm run dev
```

- Open the dev server URL (typically http://localhost:5173)
- Allow camera permission when prompted
- Click **Begin Screening** and follow the dot with your eyes

### 3) Model Placement

- Place your TF.js model at `frontend/public/model_web/model.json` (+ shard files).
- Preprocessing expects `[64,64,3]` frames, normalized to `[0,1]`, stacked as `[1, 16, 64, 64, 3]`.
  - Adjust in `frontend/src/utils/preprocessing.js` if your model differs.

## Usage

### Product flow (What the user sees)

1. **Welcome**: Begin Screening button + privacy assurance.
2. **Align**: Live camera preview with corner guides and eye boxes; center your face.
3. **Testing**: Dot stimulus (fixation, saccades, pursuit) with progress bar.
4. **Results**: Live gauge + short‑window final indicator, neutral summary, and disclaimer.

### Real model alignment

- Confirm your Python/TF preprocessing matches the browser path:
  - `MODEL_INPUT_WIDTH`, `MODEL_INPUT_HEIGHT`, `SEQUENCE_LENGTH` in `frontend/src/utils/preprocessing.js`
  - Normalization and color space (browser RGB) match your training
  - Cropping (full frame vs eye crops) if your model expects it

### Training a Model (Python, Optional/Legacy)

```python
from ml.model import NeuroSightModel

# Create model
model = NeuroSightModel(input_shape=(100, 64), num_classes=10)

# Build and train
model.build_model()
history = model.train(X_train, y_classification, y_regression, epochs=100)

# Save model
model.save_model('ml/neurosight_model.h5')
```

### Making Predictions (Python)

```python
from ml.predict import predict_neural_activity

# Load data and predict
data = load_your_brain_data()
result = predict_neural_activity(data)

print(f"Predicted classes: {result['predicted_classes']}")
print(f"Activity levels: {result['regression_predictions']}")
```

### Calling the Backend API (Optional/Legacy)

- `GET /` — Health check
- `POST /predict` — Upload an image (e.g., PNG/JPEG) and receive inference results

Example with `curl`:

```bash
curl -X POST \
  -F "file=@/path/to/image.png" \
  http://localhost:8000/predict
```

## Data Formats (Optional/Legacy)

### CSV

```csv
time,region1,region2,region3,region4
0,0.1,0.2,0.15,0.3
1,0.12,0.18,0.2,0.25
2,0.15,0.22,0.18,0.28
```

### JSON

```json
{
  "brain_activity": [
    [0.1, 0.2, 0.15, 0.3],
    [0.12, 0.18, 0.2, 0.25],
    [0.15, 0.22, 0.18, 0.28]
  ],
  "regions": ["frontal", "parietal", "temporal", "occipital"]
}
```

## Development

### Python tooling

```bash
# Run tests
pytest tests/

# Code formatting / linting
black .
flake8 .
```

### Frontend tooling

```bash
# Lint (as configured in package.json)
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Configuration

- Backend CORS is enabled for development in `backend/api.py` using `CORSMiddleware`.
- Frontend can be configured to point to a different backend URL via environment variables (e.g., `.env`, `.env.local`).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Run linting/formatting
5. Open a pull request with a clear description


## Acknowledgments

- TensorFlow.js for on‑device inference
- FastAPI (optional) for server‑side workflows
- React + Vite for the web UI
- Scikit‑learn/TensorFlow (Python) for training pipelines

---

### Privacy & Disclaimer

- All screening runs on‑device in your browser; no frames are uploaded.
- This is a preliminary screening signal and **not** a medical diagnosis.
