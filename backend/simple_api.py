# Simple backend API for NeuroSight without heavy ML dependencies

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import json
import time
import random

# Initialize FastAPI app
app = FastAPI(title="NeuroSight Backend API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "NeuroSight Backend is running."}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    This endpoint receives an image and returns a mock prediction.
    In production, this would call the actual ML model.
    """
    try:
        # Read the uploaded file
        contents = await file.read()
        
        # Simulate processing time
        time.sleep(1)
        
        # Generate mock prediction results
        risk_score = random.uniform(0.1, 0.9)
        confidence = random.uniform(0.7, 0.95)
        
        # Generate mock anomalies based on risk score
        anomalies = []
        if risk_score > 0.6:
            anomalies.append("minor_tremor")
        if risk_score > 0.7:
            anomalies.append("focus_lag")
        if risk_score > 0.8:
            anomalies.append("irregular_saccades")
        
        result = {
            "risk_score": risk_score,
            "confidence": confidence,
            "anomalies_detected": anomalies,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "model_version": "mock-v1.0",
            "processing_time_ms": 1000
        }
        
        return result
        
    except Exception as e:
        return {
            "error": f"Prediction failed: {str(e)}",
            "risk_score": 0.0,
            "confidence": 0.0,
            "anomalies_detected": [],
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
