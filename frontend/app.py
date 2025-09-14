# frontend/app.py

import streamlit as st
import requests
import os

# --- Page Configuration ---
st.set_page_config(
    page_title="NeuroSight",
    page_icon="🧠",
    layout="centered"
)

# --- Backend API Endpoint ---
# Make sure this URL matches where your backend is running.
BACKEND_URL = "http://127.0.0.1:8000/predict"

# --- UI Components ---
st.title("🧠 NeuroSight: Early Disorder Detection")
st.write(
    "Upload an image of a subject's face. The model will analyze "
    "eye movement patterns to provide a preliminary risk assessment."
)

uploaded_file = st.file_uploader(
    "Choose an image...", type=["jpg", "jpeg", "png"]
)

if uploaded_file is not None:
    # Display the uploaded image
    st.image(uploaded_file, caption="Uploaded Image.", use_column_width=True)
    st.write("")
    st.write("Analyzing...")

    # --- Call the Backend API ---
    try:
        # Prepare the file to be sent in the request
        files = {"file": (uploaded_file.name, uploaded_file, uploaded_file.type)}
        
        # Send the request to the backend
        response = requests.post(BACKEND_URL, files=files)
        
        if response.status_code == 200:
            # Display the results from the backend
            results = response.json()
            st.success("Analysis Complete!")
            st.subheader("Results")
            
            risk_score = results.get("risk_score", 0.0)
            
            # Display a progress-style bar for the risk score
            st.progress(risk_score)
            st.metric(label="Risk Score", value=f"{risk_score:.2f}")

            st.write("**Anomalies Detected:**")
            anomalies = results.get("anomalies_detected", [])
            for anomaly in anomalies:
                st.write(f"- {anomaly.replace('_', ' ').title()}")
        else:
            st.error(f"Error from server: {response.status_code} - {response.text}")

    except requests.exceptions.ConnectionError:
        st.error("Connection Error: Could not connect to the backend. Is it running?")
    except Exception as e:
        st.error(f"An unexpected error occurred: {e}")
