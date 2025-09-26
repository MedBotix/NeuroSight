# NeuroSight 

A neural network–powered brain activity analysis platform for researchers and clinicians to preprocess data, run ML inference, and visualize results via a modern web UI.

## Project Structure

```
NeuroSight/
├── backend/
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
├── ml/
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

- **Neural Models**: LSTM/ConvLSTM-based architectures for time-series brain activity
- **FastAPI Backend**: Production-ready REST API for preprocessing and prediction
- **React + Vite Frontend**: Modern, fast development experience for visualization
- **Data Preprocessing**: Configurable pipeline for cleaning and normalization
- **Real-time Visualization**: Interactive UI for exploring predictions
- **Flexible I/O**: Support for CSV/JSON and extensible input adapters

## Prerequisites

- Python 3.10+
- Node.js 18+ and npm

## Quick Start

### 1) Clone and set up

```bash
# Clone the repository
git clone <repository-url>
cd NeuroSight

# (Optional) Create and activate a virtual environment
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
# source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 2) Run the backend (FastAPI)

```bash
# From repo root
uvicorn backend.api:app --host 0.0.0.0 --port 8000 --reload
```

- Backend will be available at: http://localhost:8000
- Example endpoints: `GET /`, `POST /predict`

### 3) Run the frontend (React + Vite)

```bash
# From repo root
cd frontend
npm install
npm run dev
```

- Frontend dev server: the terminal will show a URL, typically http://localhost:5173
- The frontend is expected to call the backend at http://localhost:8000 (configure as needed)

## Usage

### Training a Model (Python)

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

### Calling the Backend API

- `GET /` — Health check
- `POST /predict` — Upload an image (e.g., PNG/JPEG) and receive inference results

Example with `curl`:

```bash
curl -X POST \
  -F "file=@/path/to/image.png" \
  http://localhost:8000/predict
```

## Data Formats

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

## License

This project is licensed under the MIT License. See `LICENSE` for details.

## Acknowledgments

- TensorFlow/Keras for neural modeling
- FastAPI for high-performance APIs
- React + Vite for the web UI
- Scikit-learn for preprocessing utilities
