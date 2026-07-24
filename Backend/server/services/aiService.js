const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

class AIService {
  constructor() {
    this.yoloUrl = process.env.YOLO_API_URL || 'http://localhost:8000/predict/image';
    this.nlpUrl = process.env.NLP_API_URL || 'http://localhost:8000/predict/text';
  }

  /**
   * Helper utility to perform API requests with exponential backoff retry handling.
   * @param {Function} fn - Async function executing the axios request
   * @param {number} retries - Number of retry attempts (default: 3)
   * @param {number} delay - Base delay in milliseconds (default: 1000)
   * @returns {Promise<any>}
   */
  async requestWithRetry(fn, retries = 3, delay = 1000) {
    try {
      return await fn();
    } catch (error) {
      if (retries <= 0) {
        console.error('AIService API request failed all retry attempts.');
        throw error;
      }
      
      const errorMessage = error.response
        ? `Status: ${error.response.status} - ${JSON.stringify(error.response.data)}`
        : error.message;

      console.warn(`AIService request failed: ${errorMessage}. Retrying in ${delay}ms... (${retries} attempts left)`);
      
      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.requestWithRetry(fn, retries - 1, delay * 2);
    }
  }

  /**
   * Send the image to the YOLOv8 API service for object detection.
   * @param {string} relativeImagePath - Path of the image file (relative to backend server root)
   * @returns {Promise<{issue: string, confidence: number}>}
   */
  async predictImage(relativeImagePath) {
    if (!relativeImagePath) {
      return { issue: 'No Image', confidence: 0.0 };
    }

    const absolutePath = path.join(__dirname, '..', relativeImagePath);

    if (!fs.existsSync(absolutePath)) {
      console.warn(`Image file not found on disk at: ${absolutePath}`);
      return { issue: 'Image Missing', confidence: 0.0 };
    }

    return this.requestWithRetry(async () => {
      const form = new FormData();
      // Streams the file upload using form-data boundary
      form.append('image', fs.createReadStream(absolutePath));

      const response = await axios.post(this.yoloUrl, form, {
        headers: {
          ...form.getHeaders(),
        },
        timeout: 5000, // 5s timeout
      });

      if (response.data && response.data.issue) {
        return {
          issue: response.data.issue,
          confidence: Number(response.data.confidence || 0.0),
        };
      }

      throw new Error('YOLOv8 API response layout invalid (missing "issue")');
    });
  }

  /**
   * Send the complaint description text to the NLP API service for routing classification.
   * @param {string} text - The complaint description content
   * @returns {Promise<{coreIssue: string, department: string, priority: string, summary: string}>}
   */
  async predictText(text) {
    if (!text || text.trim() === '') {
      return {
        coreIssue: 'None Provided',
        department: 'Public Works',
        priority: 'Medium',
        summary: '',
      };
    }

    return this.requestWithRetry(async () => {
      // Send both text and description to support flexible Python API schemas
      const response = await axios.post(
        this.nlpUrl,
        { text, description: text },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000, // 5s timeout
        }
      );

      const d = response.data;
      if (d && (d.department || d.coreIssue)) {
        return {
          coreIssue: d.coreIssue || 'Unknown',
          department: d.department || 'Public Works',
          priority: d.priority || 'Medium',
          summary: d.summary || text,
        };
      }

      throw new Error('NLP API response layout invalid (missing "department" or "coreIssue")');
    });
  }

  /**
   * Run concurrent predictions from YOLOv8 and NLP APIs, merging responses and handling failures gracefully.
   * @param {string} imagePath - Uploaded image path
   * @param {string} description - Text description of issue
   * @returns {Promise<{detectedIssue: string, department: string, priority: string, confidence: number, summary: string}>}
   */
  async analyzeComplaint(imagePath, description) {
    let yoloResult = { issue: '', confidence: 0.0 };
    let nlpResult = { coreIssue: '', department: '', priority: '', summary: '' };

    // 1) Execute YOLOv8 prediction on the uploaded photo if present
    if (imagePath) {
      try {
        console.log(`Sending image (${imagePath}) to YOLOv8 prediction pipeline...`);
        yoloResult = await this.predictImage(imagePath);
        console.log('YOLOv8 prediction response:', yoloResult);
      } catch (err) {
        console.error(`YOLOv8 Service failed. Proceeding with fallback. Error: ${err.message}`);
        yoloResult = { issue: 'Failed to analyze image', confidence: 0.0 };
      }
    }

    // 2) Execute NLP prediction on the text description if present
    if (description) {
      try {
        console.log('Sending description text to NLP pipeline...');
        nlpResult = await this.predictText(description);
        console.log('NLP prediction response:', nlpResult);
      } catch (err) {
        console.error(`NLP Service failed. Proceeding with fallback. Error: ${err.message}`);
        // Basic fallback NLP classification
        const textToAnalyze = description.toLowerCase();
        let fallbackDept = 'Public Works';
        let fallbackPriority = 'Medium';
        
        if (textToAnalyze.includes('waste') || textToAnalyze.includes('garbage') || textToAnalyze.includes('trash') || textToAnalyze.includes('dump')) {
          fallbackDept = 'Sanitation';
        } else if (textToAnalyze.includes('water') || textToAnalyze.includes('leak') || textToAnalyze.includes('sewage') || textToAnalyze.includes('drain')) {
          fallbackDept = 'Water Supply';
          fallbackPriority = 'High';
        } else if (textToAnalyze.includes('light') || textToAnalyze.includes('dark') || textToAnalyze.includes('wire') || textToAnalyze.includes('electricity')) {
          fallbackDept = 'Electricity';
        }

        nlpResult = {
          coreIssue: 'Local Text Classification',
          department: fallbackDept,
          priority: fallbackPriority,
          summary: description,
        };
      }
    }

    // 3) Merge and format the responses
    return {
      detectedIssue: yoloResult.issue && yoloResult.issue !== 'No Image' && yoloResult.issue !== 'Image Missing'
        ? yoloResult.issue
        : (nlpResult.coreIssue || 'Unknown'),
      department: nlpResult.department || 'Public Works',
      priority: nlpResult.priority || 'Medium',
      confidence: Number(yoloResult.confidence || 0.0),
      summary: nlpResult.summary || description || '',
    };
  }
}

module.exports = new AIService();
