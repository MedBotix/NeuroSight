// Frontend API service for communicating with NeuroSight backend

const API_BASE_URL = 'http://localhost:8000';

class NeuroSightAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Check if the backend API is available
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/`);
      const data = await response.json();
      return data.status === 'ok';
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }

  /**
   * Send an image to the backend for prediction
   * @param {File|Blob} imageFile - The image file to analyze
   * @returns {Promise<Object>} - Prediction results
   */
  async predict(imageFile) {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch(`${this.baseURL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Prediction request failed:', error);
      throw error;
    }
  }

  /**
   * Capture a frame from video element and send for prediction
   * @param {HTMLVideoElement} videoElement - The video element
   * @returns {Promise<Object>} - Prediction results
   */
  async predictFromVideo(videoElement) {
    return new Promise((resolve, reject) => {
      try {
        // Create a canvas to capture the current frame
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        
        // Draw the current video frame to canvas
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
          if (!blob) {
            reject(new Error('Failed to capture frame'));
            return;
          }
          
          try {
            const result = await this.predict(blob);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, 'image/jpeg', 0.8);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Start continuous prediction from video stream
   * @param {HTMLVideoElement} videoElement - The video element
   * @param {Function} onResult - Callback for each prediction result
   * @param {number} intervalMs - Interval between predictions in milliseconds
   * @returns {Function} - Function to stop continuous prediction
   */
  startContinuousPrediction(videoElement, onResult, intervalMs = 500) {
    let isRunning = true;
    
    const predict = async () => {
      if (!isRunning) return;
      
      try {
        const result = await this.predictFromVideo(videoElement);
        onResult(result);
      } catch (error) {
        console.error('Continuous prediction error:', error);
        onResult({ error: error.message });
      }
      
      if (isRunning) {
        setTimeout(predict, intervalMs);
      }
    };
    
    // Start the first prediction
    predict();
    
    // Return stop function
    return () => {
      isRunning = false;
    };
  }
}

// Create and export a singleton instance
export const neuroSightAPI = new NeuroSightAPI();
export default neuroSightAPI;
