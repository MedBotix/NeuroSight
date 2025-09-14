# data_processing/preprocess.py

import os
import cv2
import numpy as np
import mediapipe as mp  # pyright: ignore[reportMissingImports]

# --- Configuration Constants ---
# Directory where raw videos are stored
RAW_DATA_DIR = "data/raw/" 
# Directory to save the processed dataset
PROCESSED_DATA_DIR = "data/processed/"
# The desired output dimensions for each eye frame
IMG_WIDTH, IMG_HEIGHT = 64, 64
# The number of frames to use for one sequence
SEQUENCE_LENGTH = 50

# --- Initialize MediaPipe ---
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

def process_video(video_path):
    """
    Processes a single video file, extracts eye frames, and returns them as a sequence.

    Args:
        video_path: The full path to the video file.

    Returns:
        A NumPy array of the processed frame sequence, or None if processing fails.
    """
    print(f"Processing video: {video_path}")
    cap = cv2.VideoCapture(video_path)
    frames = []

    while len(frames) < SEQUENCE_LENGTH:
        ret, frame = cap.read()
        if not ret:
            break

        # --- TODO: Dev 4's Core Logic ---
        # 1. Use MediaPipe Face Mesh to find eye landmarks.
        #    results = face_mesh.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        
        # 2. From the landmarks, calculate a bounding box for the left or right eye.
        
        # 3. Crop the original frame to get just the eye region.
        #    eye_frame = frame[y:y+h, x:x+w]
        
        # 4. Normalize the eye frame: resize to (IMG_WIDTH, IMG_HEIGHT) and convert to grayscale.
        #    normalized_frame = cv2.resize(eye_frame, (IMG_WIDTH, IMG_HEIGHT))
        #    normalized_frame = cv2.cvtColor(normalized_frame, cv2.COLOR_BGR2GRAY)
        
        # 5. Add the normalized frame to our list.
        #    frames.append(normalized_frame)
        
        # For now, we'll append a dummy frame to make the script runnable
        dummy_frame = np.zeros((IMG_HEIGHT, IMG_WIDTH), dtype=np.uint8)
        frames.append(dummy_frame)
        
    cap.release()

    if len(frames) == SEQUENCE_LENGTH:
        # Reshape for the model (add channel dimension)
        return np.expand_dims(np.array(frames), axis=-1)
    else:
        print(f"Warning: Video {video_path} has fewer than {SEQUENCE_LENGTH} frames. Skipping.")
        return None

def main():
    """
    Main function to find all videos, process them, and save the final dataset.
    """
    # Ensure the output directory exists
    os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)

    all_sequences = []
    all_labels = []

    # --- TODO: Dev 4 needs to get the actual video files and their labels ---
    # For now, let's create some dummy video files to simulate.
    # You should replace this with your actual video files in `data/raw/`
    dummy_videos = ["subject1_parkinsons.mp4", "subject2_healthy.mp4"]
    for video_name in dummy_videos:
        # Simulate label extraction from filename
        label = 1 if "parkinsons" in video_name else 0
        
        sequence = process_video(os.path.join(RAW_DATA_DIR, video_name))
        
        if sequence is not None:
            all_sequences.append(sequence)
            all_labels.append(label)

    if not all_sequences:
        print("No videos processed. Exiting.")
        return

    # Convert lists to NumPy arrays
    X_data = np.array(all_sequences)
    y_data = np.array(all_labels)

    # Save the final dataset to a compressed .npz file
    dataset_path = os.path.join(PROCESSED_DATA_DIR, "dataset.npz")
    np.savez_compressed(dataset_path, X=X_data, y=y_data)
    
    print("\n--- Data Preprocessing Complete ---")
    print(f"Final dataset shape (X): {X_data.shape}")
    print(f"Final labels shape (y): {y_data.shape}")
    print(f"Dataset saved to: {dataset_path}")

if __name__ == '__main__':
    main()
