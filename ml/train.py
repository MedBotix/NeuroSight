# ml/train.py

import numpy as np
from model import build_neurosight_model # Import the model builder from our other file

def load_processed_data(file_path="data/processed/dataset.npz"):
    """
    Placeholder function to load the preprocessed data created by Dev 4.
    
    Args:
        file_path: The path to the clean dataset file.

    Returns:
        Tuples of (X_train, y_train) and (X_test, y_test).
    """
    print(f"Loading data from {file_path}...")
    # In a real scenario, this would load from the file created by preprocess.py
    # For now, we'll create dummy data to ensure the script runs.
    
    # Dummy data shape: (num_samples, sequence_length, height, width, channels)
    X_train = np.random.rand(100, 50, 64, 64, 1)
    y_train = np.random.randint(0, 2, 100)
    
    X_test = np.random.rand(20, 50, 64, 64, 1)
    y_test = np.random.randint(0, 2, 20)
    
    print("Dummy data generated successfully.")
    return (X_train, y_train), (X_test, y_test)

def main():
    """Main function to run the model training."""
    
    # 1. Load the data
    (X_train, y_train), (X_test, y_test) = load_processed_data()
    
    # 2. Build the model
    # The input shape must match the data's shape
    input_shape = X_train.shape[1:] 
    model = build_neurosight_model(input_shape=input_shape)
    
    # 3. Train the model
    print("\n--- Starting Model Training ---")
    history = model.fit(
        X_train,
        y_train,
        epochs=10, # Number of passes through the data
        batch_size=16,
        validation_data=(X_test, y_test)
    )
    print("--- Model Training Complete ---\n")
    
    # 4. Save the trained model
    model_save_path = 'ml/neurosight_model.h5'
    model.save(model_save_path)
    print(f"Model saved successfully to {model_save_path}")

if __name__ == '__main__':
    main()
