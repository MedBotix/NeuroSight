# NeuroSight 🧠

A neural network-based brain activity analysis platform that helps researchers and clinicians analyze, predict, and visualize complex brain data.

## Project Structure

```
NeuroSight/
├── backend/
│   └── api.py              # FastAPI server for handling predictions
├── frontend/
│   └── app.py              # Streamlit dashboard for visualization
├── ml/
│   ├── model.py            # Keras/TensorFlow model architecture
│   ├── train.py            # Script to train the neural network model
│   ├── predict.py          # Functions to run inference
│   └── neurosight_model.h5 # Trained model file (created after training)
├── data_processing/
│   └── preprocess.py       # Data cleaning and preparation scripts
└── requirements.txt        # Project dependencies
```

## Features

- 🧠 **Neural Network Models**: LSTM and ConvLSTM architectures for brain activity prediction
- 📊 **Interactive Dashboard**: Streamlit-based visualization interface
- 🔄 **Data Preprocessing**: Comprehensive data cleaning and preparation pipeline
- 🚀 **REST API**: FastAPI backend for scalable predictions
- 📈 **Real-time Visualization**: Interactive plots and charts for brain activity analysis
- 🔧 **Flexible Input**: Support for CSV, JSON, and other data formats

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd NeuroSight

# Install dependencies
pip install -r requirements.txt
```

### 2. Train the Model

```bash
# Train with synthetic data (for testing)
cd ml
python train.py --data synthetic --epochs 50

# Train with your own data
python train.py --data /path/to/your/data.csv --epochs 100
```

### 3. Start the Backend API

```bash
cd backend
python api.py
```

The API will be available at `http://localhost:8000`

### 4. Launch the Dashboard

```bash
cd frontend
streamlit run app.py
```

The dashboard will be available at `http://localhost:8501`

## Usage

### Training a Model

```python
from ml.model import NeuroSightModel

# Create model
model = NeuroSightModel(input_shape=(100, 64), num_classes=10)

# Build and train
model.build_model()
history = model.train(X_train, y_classification, y_regression, epochs=100)

# Save model
model.save_model('neurosight_model.h5')
```

### Making Predictions

```python
from ml.predict import predict_neural_activity

# Load data and predict
data = load_your_brain_data()
result = predict_neural_activity(data)

print(f"Predicted classes: {result['predicted_classes']}")
print(f"Activity levels: {result['regression_predictions']}")
```

### Data Preprocessing

```python
from data_processing.preprocess import BrainDataPreprocessor

# Create preprocessor
preprocessor = BrainDataPreprocessor(
    scaling_method='standard',
    remove_outliers=True,
    filter_noise=True
)

# Preprocess data
result = preprocessor.preprocess(your_data)
processed_data = result['data']
```

## API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health status
- `POST /predict` - Upload data and get predictions
- `POST /preprocess` - Preprocess data without prediction
- `GET /models` - List available models

## Data Format

### Supported Input Formats

**CSV Format:**
```csv
time,region1,region2,region3,region4
0,0.1,0.2,0.15,0.3
1,0.12,0.18,0.2,0.25
2,0.15,0.22,0.18,0.28
```

**JSON Format:**
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

## Model Architecture

The NeuroSight model uses a multi-output neural network architecture:

- **LSTM Layers**: Capture temporal patterns in brain activity
- **Dense Layers**: Extract high-level features
- **Dual Outputs**: 
  - Classification: Predict activity type/class
  - Regression: Predict activity intensity

## Development

### Running Tests

```bash
pytest tests/
```

### Code Formatting

```bash
black .
flake8 .
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with TensorFlow/Keras for neural network modeling
- FastAPI for high-performance API development
- Streamlit for interactive dashboard creation
- Scikit-learn for data preprocessing utilities
