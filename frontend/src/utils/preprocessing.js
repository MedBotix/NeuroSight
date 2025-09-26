// frontend/src/utils/preprocessing.js
import * as tf from '@tensorflow/tfjs';

// These values MUST match the model's training configuration
const MODEL_INPUT_WIDTH = 64;
const MODEL_INPUT_HEIGHT = 64;

export const preprocessFrame = (videoElement) => {
  // This function mirrors the Python preprocessing logic.
  // It converts the video frame into a tensor suitable for the model.

  const tensor = tf.browser.fromPixels(videoElement)
    .resizeBilinear([MODEL_INPUT_HEIGHT, MODEL_INPUT_WIDTH])
    .toFloat()
    .div(tf.scalar(255.0)) // Normalize pixel values to [0, 1]
    .mean(2) // Convert to grayscale by averaging the color channels
    .expandDims(0)   // Add the batch dimension (shape: [1, 64, 64])
    .expandDims(-1); // Add the channel dimension for grayscale (shape: [1, 64, 64, 1])

  return tensor;
};