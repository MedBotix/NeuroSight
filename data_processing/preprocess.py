# data_processing/preprocess.py (FINAL CORRECTED VERSION)

import os
import cv2
import numpy as np
import mediapipe as mp
import glob

# --- Configuration Constants ---
RAW_DATA_DIR = "data/raw/"
PROCESSED_DATA_DIR = "data/processed/"
IMG_WIDTH, IMG_HEIGHT = 64, 64
SEQUENCE_LENGTH = 50

# --- Initialize MediaPipe ---
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Indices for the left and right eye landmarks from MediaPipe
EYE_LANDMARKS_INDICES = [
    33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246,
    362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398
]

def get_eye_bounding_box_from_mediapipe(landmarks, frame_shape):
    h, w, _ = frame_shape
    eye_points = np.array([[landmarks[i].x * w, landmarks[i].y * h] for i in EYE_LANDMARKS_INDICES], dtype=np.int32)
    
    min_x, max_x = np.min(eye_points[:, 0]), np.max(eye_points[:, 0])
    min_y, max_y = np.min(eye_points[:, 1]), np.max(eye_points[:, 1])

    pad_x = (max_x - min_x) * 0.2
    pad_y = (max_y - min_y) * 0.4
    
    min_x, max_x = int(min_x - pad_x), int(max_x + pad_x)
    min_y, max_y = int(min_y - pad_y), int(max_y + pad_y)

    return min_x, min_y, max_x, max_y

def process_mpiigaze(base_path):
    all_sequences = []
    all_labels = []
    current_sequence = []
    
    image_paths = glob.glob(os.path.join(base_path, '**', '*.jpg'), recursive=True)
    
    print(f"Found {len(image_paths)} images to process in MPIIGaze.")
    
    if not image_paths:
        print("Warning: No images found. Please check the directory structure inside data/raw/MPIIGaze.")
        return np.array([]), np.array([])

    for image_path in image_paths:
        frame = cv2.imread(image_path)
        if frame is None:
            continue
        
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb_frame)

        if results.multi_face_landmarks:
            face_landmarks = results.multi_face_landmarks[0].landmark
            
            x1, y1, x2, y2 = get_eye_bounding_box_from_mediapipe(face_landmarks, frame.shape)
            
            x1, y1 = max(0, x1), max(0, y1)
            x2, y2 = min(frame.shape[1], x2), min(frame.shape[0], y2)
            
            if x2 <= x1 or y2 <= y1:
                continue
                
            eye_frame = frame[y1:y2, x1:x2]
            normalized_frame = cv2.resize(eye_frame, (IMG_WIDTH, IMG_HEIGHT))
            
            # --- CORRECTION ---
            # The line converting to grayscale is now removed to keep the 3 color channels.
            
            current_sequence.append(normalized_frame)
            
            if len(current_sequence) == SEQUENCE_LENGTH:
                all_sequences.append(np.array(current_sequence))
                all_labels.append(0) # Assuming label 0 for this dataset
                current_sequence = []

    print(f"Extracted {len(all_sequences)} sequences from MPIIGaze.")
    return np.array(all_sequences), np.array(all_labels)


def main():
    os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)
    X_data, y_data = [], []

    mpii_path = os.path.join(RAW_DATA_DIR, "MPIIGaze")
    if os.path.exists(mpii_path):
        print("--- Processing MPIIGaze Dataset with Automatic Eye Detection ---")
        X_mpii, y_mpii = process_mpiigaze(mpii_path)
        if len(X_mpii) > 0:
            X_data.append(X_mpii)
            y_data.append(y_mpii)
    else:
        print("MPIIGaze directory not found.")

    if not X_data:
        print("No datasets processed. Exiting.")
        return

    X_final = np.concatenate(X_data, axis=0)
    y_final = np.concatenate(y_data, axis=0)
    
    # --- CORRECTION ---
    # The expand_dims line is removed as it's not needed for 3-channel color images.

    dataset_path = os.path.join(PROCESSED_DATA_DIR, "tier1_dataset.npz")
    np.savez_compressed(dataset_path, X=X_final, y=y_final)
    
    print("\n--- Data Preprocessing Complete ---")
    print(f"Final dataset shape (X): {X_final.shape}")
    print(f"Final labels shape (y): {y_final.shape}")
    print(f"Dataset saved to: {dataset_path}")


if __name__ == '__main__':
    main()