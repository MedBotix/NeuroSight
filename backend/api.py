# backend/api.py

import sys
import os
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2

# This allows this file to import from the sibling `ml` directory
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# --- This is the connection ---
# We now import the actual prediction function from Joel's file.
from ml.predict import run_prediction

# --- Initialize FastAPI app ---
app = FastAPI(title="NeuroSight Backend API")
# ... (rest of the FastAPI setup code is the same) ...
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"status": "ok", "message": "NeuroSight Backend is running."}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    This endpoint receives an image, passes it to the ML model for inference,
    and returns the prediction.
    """
    # 1. Read and decode the image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 2. Call the imported ML model's prediction function
    result = run_prediction(image)
    
    # 3. Return the result as JSON
    return result