# ml/train.py

import numpy as np
import os
from model import build_neurosight_model # Imports our new MobileNetV2-based model

# --- Hyperparameters ---
# We can easily adjust these settings for tuning
LEARNING_RATE = 0.001
BATCH_SIZE = 32
EPOCHS = 20

def load_processed_data(file_path="data/processed/tier1_dataset.npz"):
    """
    Loads the preprocessed data. Note that we will update the preprocess.py
    script to save color images (3 channels).
    """
    print(f"Loading data from {file_path}...")
    
    if not os.path.exists(file_path):
        print(f"Warning: Dataset not found at {file_path}. Generating dummy data.")
        # Dummy data shape: (num_samples, sequence_length, height, width, channels)
        # Note the 3 channels for color images.
        X_train = np.random.rand(100, 50, 64, 64, 3)
        y_train = np.random.randint(0, 2, 100)
        X_test = np.random.rand(20, 50, 64, 64, 3)
        y_test = np.random.randint(0, 2, 20)
        return (X_train, y_train), (X_test, y_test)

    with np.load(file_path) as data:
        # Assuming the .npz file contains 'X' and 'y' keys
        # TODO: Split this data into train and test sets
        X_data = data['X']
        y_data = data['y']
        # For now, using a simple split. A proper split should be done.
        X_train, X_test = X_data[:80], X_data[80:]
        y_train, y_test = y_data[:80], y_data[80:]
        print("Data loaded successfully.")
        return (X_train, y_train), (X_test, y_test)

def main():
    """Main function to run the model training."""
    
    # 1. Load the data
    (X_train, y_train), (X_test, y_test) = load_processed_data()
    
    # 2. Build the model
    input_shape = X_train.shape[1:] 
    model = build_neurosight_model(input_shape=input_shape)
    
    # Optional: Adjust learning rate if needed
    # tf.keras.backend.set_value(model.optimizer.learning_rate, LEARNING_RATE)
    
    # 3. Train the model
    print("\n--- Starting Model Training ---")
    history = model.fit(
        X_train,
        y_train,
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        validation_data=(X_test, y_test)
    )
    print("--- Model Training Complete ---\n")
    
    # 4. Save the trained model
    model_save_path = 'ml/neurosight_baseline.h5'
    model.save(model_save_path)
    print(f"Model saved successfully to {model_save_path}")

if __name__ == '__main__':
    main()