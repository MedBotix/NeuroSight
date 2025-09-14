# ml/model.py

import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, TimeDistributed, Conv2D, MaxPooling2D, Flatten, LSTM, Dense

def build_neurosight_model(input_shape=(50, 64, 64, 1)):
    """
    Builds the CNN+LSTM model for eye movement analysis.

    Args:
        input_shape: A tuple defining the shape of the input data
                     (sequence_length, height, width, channels).

    Returns:
        A compiled Keras model.
    """
    # Input layer expects a sequence of images
    input_layer = Input(shape=input_shape)

    # --- Convolutional Layers (to find features in each frame) ---
    # The TimeDistributed wrapper applies the same Conv2D layer to each frame in the sequence.
    cnn = TimeDistributed(Conv2D(32, (3, 3), activation='relu'))(input_layer)
    cnn = TimeDistributed(MaxPooling2D((2, 2)))(cnn)
    cnn = TimeDistributed(Conv2D(64, (3, 3), activation='relu'))(cnn)
    cnn = TimeDistributed(MaxPooling2D((2, 2)))(cnn)
    cnn = TimeDistributed(Flatten())(cnn)

    # --- Recurrent Layers (to find patterns across frames) ---
    # The LSTM layer analyzes the sequence of features extracted by the CNN.
    lstm = LSTM(64, activation='relu')(cnn)

    # --- Output Layer (to make the final prediction) ---
    output_layer = Dense(1, activation='sigmoid')(lstm) # Sigmoid for binary classification (risk/no risk)

    # Create and compile the model
    model = Model(inputs=input_layer, outputs=output_layer)
    
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    
    print("NeuroSight model built successfully.")
    model.summary()
    
    return model
