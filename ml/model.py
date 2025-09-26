# ml/model.py

import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, TimeDistributed, Flatten, LSTM, Dense, Dropout
from tensorflow.keras.applications import MobileNetV2

def build_neurosight_model(input_shape=(50, 64, 64, 3)):
    """
    Builds the CNN+LSTM model using MobileNetV2 for transfer learning.

    Note: The input shape now requires 3 channels (color) for MobileNetV2.
    We will adjust the preprocessing script to handle this.

    Args:
        input_shape: A tuple for the input data shape
                     (sequence_length, height, width, channels).

    Returns:
        A compiled Keras model.
    """
    # --- Input Layer ---
    # Expects a sequence of color images
    input_layer = Input(shape=input_shape)

    # --- Load Pre-trained Base Model (MobileNetV2) ---
    # We use a model pre-trained on the massive ImageNet dataset.
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False, # We don't need the final classification layer
        input_shape=input_shape[1:] # Shape of a single frame: (64, 64, 3)
    )
    
    # Freeze the layers of the pre-trained model so they don't get updated
    # during our initial training. We are using them as-is.
    base_model.trainable = False

    # --- CNN Feature Extraction (using MobileNetV2) ---
    # Wrap the base_model in a TimeDistributed layer to apply it
    # to each of the 50 frames in our sequence.
    cnn_extractor = TimeDistributed(base_model)(input_layer)
    
    # Flatten the output of the CNN before feeding it to the LSTM
    cnn_flat = TimeDistributed(Flatten())(cnn_extractor)

    # --- Recurrent Layers (to find patterns across frames) ---
    lstm_layer = LSTM(128, activation='relu')(cnn_flat)
    
    # Add a Dropout layer to prevent overfitting
    dropout_layer = Dropout(0.4)(lstm_layer)

    # --- Output Layer (to make the final prediction) ---
    output_layer = Dense(1, activation='sigmoid')(dropout_layer)

    # --- Create and Compile the Final Model ---
    model = Model(inputs=input_layer, outputs=output_layer)
    
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    
    print("NeuroSight model with MobileNetV2 base built successfully.")
    model.summary()
    
    return model