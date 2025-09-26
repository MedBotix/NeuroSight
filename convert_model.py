# convert_model.py

import tensorflow as tf
import tensorflowjs as tfjs
import os

print("--- Starting Model Conversion ---")

# Define the input and output paths
keras_model_path = "ml/neurosight_baseline.h5"
output_path = "frontend/public/model_web"

# Check if the input model file exists
if not os.path.exists(keras_model_path):
    print(f"ERROR: Keras model not found at {keras_model_path}")
else:
    try:
        # Load the Keras model
        print(f"Loading Keras model from: {keras_model_path}")
        model = tf.keras.models.load_model(keras_model_path)

        # Create the output directory if it doesn't exist
        os.makedirs(output_path, exist_ok=True)

        # Use the tensorflowjs Python API to convert and save the model
        print(f"Converting model and saving to: {output_path}")
        tfjs.converters.save_keras_model(model, output_path)

        print("\n--- Model Conversion Successful! ---")
        print(f"Your web-friendly model is ready in the '{output_path}' folder.")

    except ImportError:
        print("\nERROR: The 'tensorflowjs' library is not installed.")
        print("Please run 'pip install tensorflowjs' in your activated virtual environment.")
    except Exception as e:
        print(f"\nAn unexpected error occurred: {e}")