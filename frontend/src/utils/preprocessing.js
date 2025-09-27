import * as tf from '@tensorflow/tfjs';

// These values MUST match the model's training configuration
export const MODEL_INPUT_WIDTH = 64;
export const MODEL_INPUT_HEIGHT = 64;
export const SEQUENCE_LENGTH = 16; // adjust to match Python/LSTM sequence length

// Optional: channel order and normalization parameters if they differ in Python
// Example: mean/std normalization hooks (set to 0/1 if not used)
const MEAN = [0.0, 0.0, 0.0];
const STD = [1.0, 1.0, 1.0];

/**
 * Convert a video frame to a normalized tensor suitable for the model.
 * Shape out (no batch): [H, W, 3]
 */
export const preprocessFrameToTensor = (videoElement) => {
  return tf.tidy(() => {
    const img = tf.browser.fromPixels(videoElement);
    let x = tf.image.resizeBilinear(img, [MODEL_INPUT_HEIGHT, MODEL_INPUT_WIDTH]).toFloat();
    // Normalize to [0,1]
    x = x.div(255.0);
    // Optional per-channel standardization
    const mean = tf.tensor1d(MEAN);
    const std = tf.tensor1d(STD);
    x = x.sub(mean).div(std);
    return x; // [H, W, 3]
  });
};

/**
 * Stack a rolling window of frames into the model's expected input shape.
 * If the temporal model expects [B, T, H, W, C], we create that batch.
 */
export const stackSequence = (frames) => {
  // frames: Array<Tensor3D> length = SEQUENCE_LENGTH
  return tf.tidy(() => {
    const stacked = tf.stack(frames, 0); // [T, H, W, C]
    const batched = stacked.expandDims(0); // [1, T, H, W, C]
    return batched;
  });
};

// Backward compatibility (if any code imports preprocessFrame)
export const preprocessFrame = (videoElement) => {
  return preprocessFrameToTensor(videoElement).expandDims(0); // [1, H, W, C]
};