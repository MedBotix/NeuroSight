# data_processing/preprocess.py

import os
import cv2
import numpy as np
import mediapipe as mp
import random

# --- Configuration Constants ---
RAW_DATA_DIR = "data/raw/"
PROCESSED_DATA_DIR = "data/processed/"
IMG_WIDTH, IMG_HEIGHT = 64, 64
SEQUENCE_LENGTH = 50
# Landmark indices for the left eye outline provided by MediaPipe
LEFT_EYE_LANDMARKS = [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7]


# --- Initialize MediaPipe ---
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

def augment_frame(frame):
    # (Augmentation logic remains the same as before)
    alpha = 1.0 + random.uniform(-0.2, 0.2)
    beta = 0 + random.uniform(-20, 20)
    frame = cv2.convertScaleAbs(frame, alpha=alpha, beta=beta)
    height, width = frame.shape[:2]
    center = (width / 2, height / 2)
    angle = random.uniform(-5, 5)
    rotation_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    frame = cv2.warpAffine(frame, rotation_matrix, (width, height))
    return frame

def get_eye_bounding_box(landmarks, frame_shape):
    """Calculates a bounding box for the left eye from face landmarks."""
    h, w, _ = frame_shape
    eye_points = np.array([(landmarks.landmark[i].x * w, landmarks.landmark[i].y * h) for i in LEFT_EYE_LANDMARKS])
    
    x_min, y_min = np.min(eye_points, axis=0).astype(int)
    x_max, y_max = np.max(eye_points, axis=0).astype(int)

    # Add some padding
    padding = 10
    x_min = max(0, x_min - padding)
    y_min = max(0, y_min - padding)
    x_max = min(w, x_max + padding)
    y_max = min(h, y_max + padding)
    
    return x_min, y_min, x_max, y_max

def process_video(video_path):
    """
    Processes a video: augments, finds the face, crops the eye,
    and returns a sequence of processed frames.
    """
    print(f"Processing video: {video_path}")
    cap = cv2.VideoCapture(video_path)
    frames = []

    while len(frames) < SEQUENCE_LENGTH:
        ret, frame = cap.read()
        if not ret:
            break

        frame = augment_frame(frame)
        
        # Convert the BGR image to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb_frame)

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                # --- This is the new logic that replaces the TODO ---
                x_min, y_min, x_max, y_max = get_eye_bounding_box(face_landmarks, frame.shape)
                
                # Crop the original frame to the eye region
                cropped_eye = frame[y_min:y_max, x_min:x_max]
                
                if cropped_eye.size == 0:
                    continue # Skip if crop is empty

                # Normalize and add the frame to our sequence
                normalized_frame = cv2.resize(cropped_eye, (IMG_WIDTH, IMG_HEIGHT))
                frames.append(normalized_frame)
                break # Process only the first detected face
        
    cap.release()

    if len(frames) == SEQUENCE_LENGTH:
        return np.array(frames)
    else:
        print(f"Warning: Could not extract enough frames from {video_path}. Skipping.")
        return None

# (The main() function remains the same as before)
def main():
    # ... (rest of the main function) ...
    os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)
    all_sequences = []
    all_labels = []
    dummy_videos = ["subject1_parkinsons.mp4", "subject2_healthy.mp4"]
    for video_name in dummy_videos:
        label = 1 if "parkinsons" in video_name else 0
        sequence = process_video(os.path.join(RAW_DATA_DIR, video_name))
        if sequence is not None:
            all_sequences.append(sequence)
            all_labels.append(label)
    if not all_sequences:
        print("No videos processed. Exiting.")
        return
    X_data = np.array(all_sequences)
    y_data = np.array(all_labels)
    dataset_path = os.path.join(PROCESSED_DATA_DIR, "tier1_dataset.npz")
    np.savez_compressed(dataset_path, X=X_data, y=y_data)
    print(f"\n--- Data Preprocessing Complete ---\nDataset saved to: {dataset_path}")

if __name__ == '__main__':
    main()